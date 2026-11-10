import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/ui/status-indicator";

describe("UI Primitives & Design System Tokens", () => {
  it("renders Button and handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables Button when isLoading or disabled is true", () => {
    const { rerender } = render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(<Button isLoading>Loading Button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders Badge with accessible risk variants and non-color icons", () => {
    const { rerender } = render(
      <Badge variant="risk-high" showIcon>
        High Risk (&ge; 0.50)
      </Badge>
    );
    expect(screen.getByText(/high risk/i)).toBeInTheDocument();

    rerender(
      <Badge variant="risk-moderate" showIcon>
        Moderate Risk
      </Badge>
    );
    expect(screen.getByText(/moderate risk/i)).toBeInTheDocument();

    rerender(
      <Badge variant="risk-low" showIcon>
        Low Risk
      </Badge>
    );
    expect(screen.getByText(/low risk/i)).toBeInTheDocument();
  });

  it("renders Card with header, title, description, and content", () => {
    render(
      <Card density="compact">
        <CardHeader>
          <CardTitle>Customer Overview</CardTitle>
          <CardDescription>Active cohort details</CardDescription>
        </CardHeader>
        <CardContent>Content Area</CardContent>
      </Card>
    );

    expect(screen.getByText("Customer Overview")).toBeInTheDocument();
    expect(screen.getByText("Active cohort details")).toBeInTheDocument();
    expect(screen.getByText("Content Area")).toBeInTheDocument();
  });

  it("renders StatusIndicator with text and dot for operational states", () => {
    const { rerender } = render(<StatusIndicator status="READY" />);
    expect(screen.getByText("Ready")).toBeInTheDocument();

    rerender(<StatusIndicator status="PARTIALLY_READY" label="Partial Coverage" />);
    expect(screen.getByText("Partial Coverage")).toBeInTheDocument();

    rerender(<StatusIndicator status="UNSUPPORTED" />);
    expect(screen.getByText("Unsupported")).toBeInTheDocument();
  });
});
