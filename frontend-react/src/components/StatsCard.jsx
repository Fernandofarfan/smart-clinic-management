import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3`} style={{ backgroundColor: color }}>
                        {Icon && <Icon className="h-6 w-6 text-white" />}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-lg font-medium text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
