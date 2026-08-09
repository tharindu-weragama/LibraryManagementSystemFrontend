function StatCard({
    title,
    value,
    subtitle
}) {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-body text-center">
                <h5 className="card-title">
                    {title}
                </h5>

                <p className="fs-2 fw-bold mb-1">
                    {value}
                </p>

                {subtitle && (
                    <small className="text-muted">
                        {subtitle}
                    </small>
                )}
            </div>
        </div>
    );
}

export default StatCard;