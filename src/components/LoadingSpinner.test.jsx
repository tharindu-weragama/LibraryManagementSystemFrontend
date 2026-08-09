import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
    test("displays the default loading message", () => {
        render(<LoadingSpinner />);

        const loadingTexts =
            screen.getAllByText("Loading...");

        expect(loadingTexts.length).toBeGreaterThan(0);
    });

    test("displays a custom loading message", () => {
        render(
            <LoadingSpinner message="Loading books..." />
        );

        expect(
            screen.getByText("Loading books...")
        ).toBeInTheDocument();
    });

    test("renders a loading status element", () => {
        render(<LoadingSpinner />);

        expect(
            screen.getByRole("status")
        ).toBeInTheDocument();
    });
});