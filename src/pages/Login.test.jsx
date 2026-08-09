import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import Login from "./Login";
import authReducer from "../redux/slices/authSlice";
import { login } from "../services/authService";

const mockNavigate = vi.fn();

vi.mock("../services/authService", () => ({
    login: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function renderLogin() {
    const store = configureStore({
        reducer: {
            auth: authReducer,
        },
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </Provider>
    );
}

describe("Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test("renders the login form", () => {
        renderLogin();

        expect(
            screen.getByRole("heading", {
                name: "Login",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Email")
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Password")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Login",
            })
        ).toBeInTheDocument();
    });

    test("calls login API with entered email and password", async () => {
        const user = userEvent.setup();

        login.mockResolvedValue({
            data: {
                accessToken: "access-token",
                refreshToken: "refresh-token",
                user: {
                    userId: "1",
                    fullName: "Test User",
                    email: "test@example.com",
                    roles: ["Member"],
                },
            },
        });

        renderLogin();

        await user.type(
            screen.getByLabelText("Email"),
            "test@example.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "Password@123"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Login",
            })
        );

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "Password@123",
            });
        });
    });

    test("stores authentication data after successful login", async () => {
        const user = userEvent.setup();

        const responseUser = {
            userId: "1",
            fullName: "Test User",
            email: "test@example.com",
            roles: ["Member"],
        };

        login.mockResolvedValue({
            data: {
                accessToken: "access-token",
                refreshToken: "refresh-token",
                user: responseUser,
            },
        });

        renderLogin();

        await user.type(
            screen.getByLabelText("Email"),
            "test@example.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "Password@123"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Login",
            })
        );

        await waitFor(() => {
            expect(
                localStorage.getItem("accessToken")
            ).toBe("access-token");

            expect(
                localStorage.getItem("refreshToken")
            ).toBe("refresh-token");

            expect(
                JSON.parse(
                    localStorage.getItem("user")
                )
            ).toEqual(responseUser);
        });
    });

    test("navigates to dashboard after successful login", async () => {
        const user = userEvent.setup();

        login.mockResolvedValue({
            data: {
                accessToken: "access-token",
                refreshToken: "refresh-token",
                user: {
                    userId: "1",
                    fullName: "Test User",
                    email: "test@example.com",
                    roles: ["Member"],
                },
            },
        });

        renderLogin();

        await user.type(
            screen.getByLabelText("Email"),
            "test@example.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "Password@123"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Login",
            })
        );

        await waitFor(() => {
            expect(
                mockNavigate
            ).toHaveBeenCalledWith(
                "/dashboard"
            );
        });
    });

    test("shows backend error when login fails", async () => {
        const user = userEvent.setup();

        login.mockRejectedValue({
            response: {
                data: {
                    message:
                        "Invalid email or password.",
                },
            },
        });

        renderLogin();

        await user.type(
            screen.getByLabelText("Email"),
            "wrong@example.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "WrongPassword"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Login",
            })
        );

        expect(
            await screen.findByText(
                "Invalid email or password."
            )
        ).toBeInTheDocument();
    });
});