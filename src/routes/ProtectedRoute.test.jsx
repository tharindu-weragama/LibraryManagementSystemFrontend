import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
    beforeEach,
    describe,
    expect,
    test
} from "vitest";

import ProtectedRoute from "./ProtectedRoute";
import authReducer from "../redux/slices/authSlice";

function renderWithStore(
    ui,
    {
        user = null,
        token = null,
        initialEntries = ["/protected"]
    } = {}
) {
    const store = configureStore({
        reducer: {
            auth: authReducer
        },

        preloadedState: {
            auth: {
                user,
                isAuthenticated: Boolean(user)
            }
        }
    });

    if (token) {
        localStorage.setItem(
            "accessToken",
            token
        );
    }

    return render(
        <Provider store={store}>
            <MemoryRouter
                initialEntries={initialEntries}
            >
                {ui}
            </MemoryRouter>
        </Provider>
    );
}

describe("ProtectedRoute", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("renders protected content when user has a valid token and no role restriction", () => {
        renderWithStore(
            <ProtectedRoute>
                <div>
                    Protected Content
                </div>
            </ProtectedRoute>,
            {
                token: "test-token",
                user: {
                    fullName: "Test User",
                    roles: ["Member"]
                }
            }
        );

        expect(
            screen.getByText(
                "Protected Content"
            )
        ).toBeInTheDocument();
    });

    test("renders protected content when user has an allowed role", () => {
        renderWithStore(
            <ProtectedRoute
                allowedRoles={["Admin"]}
            >
                <div>
                    Admin Content
                </div>
            </ProtectedRoute>,
            {
                token: "test-token",
                user: {
                    fullName: "Admin User",
                    roles: ["Admin"]
                }
            }
        );

        expect(
            screen.getByText(
                "Admin Content"
            )
        ).toBeInTheDocument();
    });

    test("shows access denied when user does not have an allowed role", () => {
        renderWithStore(
            <ProtectedRoute
                allowedRoles={["Admin"]}
            >
                <div>
                    Admin Content
                </div>
            </ProtectedRoute>,
            {
                token: "test-token",
                user: {
                    fullName: "Member User",
                    roles: ["Member"]
                }
            }
        );

        expect(
            screen.getByText(
                "Access Denied"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "Admin Content"
            )
        ).not.toBeInTheDocument();
    });

    test("does not render protected content when no access token exists", () => {
        renderWithStore(
            <ProtectedRoute>
                <div>
                    Protected Content
                </div>
            </ProtectedRoute>,
            {
                user: null,
                token: null
            }
        );

        expect(
            screen.queryByText(
                "Protected Content"
            )
        ).not.toBeInTheDocument();
    });
});