
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-[color:var(--accent-color)]" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;