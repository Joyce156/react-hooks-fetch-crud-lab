import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";
import App from "../components/App";

// Start and stop the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/View Questions/i));

  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // Wait for initial data to be fetched
  await screen.findByText(/lorem testum 1/i);

  // Navigate to the form page
  fireEvent.click(screen.getByText("New Question"));

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/i), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/i), {
    target: { value: "Test Answer 3" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/i), {
    target: { value: "Test Answer 4" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: "1" },
  });

  // Submit the form
  fireEvent.click(screen.getByText(/Add Question/i));

  // Navigate back to the list
  fireEvent.click(screen.getByText(/View Questions/i));

  // Check for the new prompt
  expect(await screen.findByText(/Test Prompt/i)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/View Questions/i));

  // Wait for a known question
  await screen.findByText(/lorem testum 1/i);

  // Click delete on the first one
  const deleteButtons = screen.getAllByText(/Delete Question/i);
  fireEvent.click(deleteButtons[0]);

  // Wait for it to disappear
  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/i));

  // Ensure the other one still exists
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
  expect(screen.queryByText(/lorem testum 1/i)).not.toBeInTheDocument();
});

test("updates the correct answer when the dropdown is changed", async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/View Questions/i));

  await screen.findByText(/lorem testum 2/i);

  // Locate the first correct answer dropdown
  const selects = screen.getAllByLabelText(/Correct Answer/i);

  // Change the value to "3"
  fireEvent.change(selects[0], { target: { value: "3" } });

  // Wait for the component to re-render with updated value
  await waitFor(() => {
    expect(screen.getAllByLabelText(/Correct Answer/i)[0].value).toBe("3");
  });
});
