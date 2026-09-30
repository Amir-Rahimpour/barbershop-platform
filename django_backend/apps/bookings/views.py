from datetime import datetime, timedelta, time
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Appointment, AppointmentStatus
from django_backend.apps.barbers.models import BarberProfile, WorkingHour, DayOff
from django_backend.apps.services.models import Service

def time_to_minutes(t: time) -> int:
    return t.hour * 60 + t.minute

def minutes_to_time(m: int) -> time:
    return time(hour=m // 60, minute=m % 60)

class AvailableSlotsAPIView(APIView):
    """
    API endpoint calculating available non-overlapping time slots
    respecting working hours, break times, days off, existing bookings,
    and service duration.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        barber_id = request.query_params.get('barber_id')
        service_id = request.query_params.get('service_id')
        date_str = request.query_params.get('date') # YYYY-MM-DD

        if not all([barber_id, service_id, date_str]):
            return Response(
                {"error": "پارامترهای barber_id, service_id و date الزامی هستند."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "فرمت تاریخ نامعتبر است (YYYY-MM-DD)."}, status=status.HTTP_400_BAD_REQUEST)

        barber = get_object_or_404(BarberProfile, id=barber_id, is_active=True)
        service = get_object_or_404(Service, id=service_id, is_active=True)

        # 1. Check holiday / Day off
        is_off = DayOff.objects.filter(
            models.Q(barber=barber) | models.Q(barber__isnull=True),
            date=target_date
        ).exists()
        if is_off:
            return Response({"date": date_str, "slots": []})

        # 2. Check barber working hours for this day of week
        # Python weekday: Mon=0, Tue=1, ..., Sat=5, Sun=6
        # Convert to our Persian Saturday=0: (weekday + 2) % 7
        persian_day_of_week = (target_date.weekday() + 2) % 7
        working_hour = WorkingHour.objects.filter(
            barber=barber,
            day_of_week=persian_day_of_week,
            is_open=True
        ).first()

        if not working_hour:
            return Response({"date": date_str, "slots": []})

        shift_start = time_to_minutes(working_hour.start_time)
        shift_end = time_to_minutes(working_hour.end_time)
        break_start = time_to_minutes(working_hour.break_start) if working_hour.break_start else None
        break_end = time_to_minutes(working_hour.break_end) if working_hour.break_end else None

        duration = service.duration_minutes
        step_interval = 30 # minutes

        # 3. Retrieve existing appointments for this barber & date
        existing_appointments = Appointment.objects.filter(
            barber=barber,
            date=target_date
        ).exclude(status=AppointmentStatus.CANCELLED)

        existing_intervals = [
            (time_to_minutes(app.start_time), time_to_minutes(app.end_time))
            for app in existing_appointments
        ]

        # 4. Generate candidate slots and verify constraints
        slots = []
        now = timezone.localtime()
        is_today = (target_date == now.date())
        current_minutes = now.hour * 60 + now.minute

        for slot_start in range(shift_start, shift_end - duration + 1, step_interval):
            slot_end = slot_start + duration
            is_available = True
            conflict_reason = None

            # Past time check
            if is_today and slot_start <= current_minutes + 15:
                is_available = False
                conflict_reason = "زمان سپری شده است"

            # Break time collision
            if is_available and break_start and break_end:
                if slot_start < break_end and slot_end > break_start:
                    is_available = False
                    conflict_reason = "زمان استراحت آرایشگر"

            # Existing appointment collisions
            if is_available:
                for app_start, app_end in existing_intervals:
                    if slot_start < app_end and slot_end > app_start:
                        is_available = False
                        conflict_reason = "قبلاً رزرو شده است"
                        break

            slots.append({
                "start_time": minutes_to_time(slot_start).strftime("%H:%M"),
                "end_time": minutes_to_time(slot_end).strftime("%H:%M"),
                "is_available": is_available,
                "conflict_reason": conflict_reason
            })

        return Response({
            "date": date_str,
            "barber": barber.user.get_full_name(),
            "service": service.name,
            "duration_minutes": duration,
            "slots": slots
        })
