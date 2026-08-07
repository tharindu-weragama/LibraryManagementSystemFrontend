function Dashboard() {
  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-3">
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Books</h5>
              <p className="card-text fs-4">0</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Users</h5>
              <p className="card-text fs-4">0</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Loans</h5>
              <p className="card-text fs-4">0</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Fines</h5>
              <p className="card-text fs-4">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;