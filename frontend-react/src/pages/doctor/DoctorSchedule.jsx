import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const DoctorSchedule = () => {
    // Mock Schedule Data
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-surface-900">Weekly Schedule</h2>
                    <p className="text-surface-500">Manage your availability and appointments</p>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 border border-surface-200 rounded-lg hover:bg-surface-50">
                        <ChevronLeft className="w-5 h-5 text-surface-600" />
                    </button>
                    <button className="px-4 py-2 border border-surface-200 rounded-lg text-surface-700 font-medium hover:bg-surface-50">
                        Today
                    </button>
                    <button className="p-2 border border-surface-200 rounded-lg hover:bg-surface-50">
                        <ChevronRight className="w-5 h-5 text-surface-600" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <div className="grid grid-cols-8 divide-x divide-surface-100 border-b border-surface-100">
                    <div className="p-4 text-xs font-semibold text-surface-400 text-center uppercase tracking-wider">Time</div>
                    {weekDays.map(day => (
                        <div key={day} className="p-4 text-center">
                            <span className="block text-sm font-semibold text-surface-900">{day}</span>
                            <span className="block text-xs text-surface-500 mt-1">12 Oct</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-8 divide-x divide-surface-100 bg-surface-50/50">
                    {/* Time Column */}
                    <div className="divide-y divide-surface-100">
                        {timeSlots.map(time => (
                            <div key={time} className="h-20 flex items-center justify-center text-xs text-surface-400 font-medium">
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Days Columns (Empty Grid for now) */}
                    {weekDays.map((day, dayIndex) => (
                        <div key={day} className="divide-y divide-surface-100 relative">
                            {timeSlots.map((time, timeIndex) => (
                                <div key={time} className="h-20 hover:bg-surface-100/50 transition-colors cursor-pointer border-b border-surface-100/50 group relative">
                                    {/* Mock Appointment Item */}
                                    {dayIndex === 1 && timeIndex === 2 && (
                                        <div className="absolute inset-1 bg-primary-100 border border-primary-200 rounded-lg p-2 flex flex-col justify-center">
                                            <span className="text-xs font-bold text-primary-700">Alice Brown</span>
                                            <span className="text-[10px] text-primary-600">Check-up</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedule;
