import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function MainLayout() {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">

            <Navbar />

            <div className="container-fluid flex-grow-1 px-0">

                <div className="row g-0 min-vh-100">

                    <div className="col-12 col-md-3 col-lg-2 col-xl-2">
                        <Sidebar />
                    </div>

                    <div className="col-12 col-md-9 col-lg-10 col-xl-10">

                        <main className="py-4 px-3 px-sm-4 px-lg-4 px-xl-5">

                            <div
                                className="w-100"
                                style={{
                                    maxWidth: "1500px",
                                    margin: "0 auto"
                                }}
                            >
                                <Outlet />
                            </div>

                        </main>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}

export default MainLayout;