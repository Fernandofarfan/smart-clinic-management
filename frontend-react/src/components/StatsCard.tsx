import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3`} style={{ backgroundColor: color }}>
                        {Icon && <Icon className="h-6 w-6 text-white" />}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
