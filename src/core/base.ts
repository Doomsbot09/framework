import inquirer from "inquirer";

/**
 * Prompts the user for confirmation with a custom message.
 *
 * @param message - The message to display for confirmation.
 * @returns A promise that resolves to a boolean indicating the user's confirmation.
 */
export async function confirmation(message: string): Promise<boolean> {
  const answers = await inquirer.prompt([
    { type: "confirm", name: "confirm", message: message },
  ]);
  return answers.confirm;
}
