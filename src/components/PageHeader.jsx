function PageHeader({
    title,
    buttonText,
    onButtonClick,
    showButton = false,
    buttonClass = "btn btn-primary"
}) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">
                {title}
            </h2>

            {showButton && (
                <button
                    type="button"
                    className={buttonClass}
                    onClick={onButtonClick}
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
}

export default PageHeader;