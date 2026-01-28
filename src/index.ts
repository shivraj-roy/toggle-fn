import { showHUD } from "@raycast/api";
import { execSync } from "child_process";

const ACTIVATE_SETTINGS_PATH =
  "/System/Library/PrivateFrameworks/SystemAdministration.framework/Resources/activateSettings";

function getCurrentFnState(): boolean {
  try {
    const result = execSync("defaults read -g com.apple.keyboard.fnState", {
      encoding: "utf-8",
    }).trim();
    return result === "1";
  } catch {
    return false;
  }
}

function setFnState(enabled: boolean): void {
  const value = enabled ? "true" : "false";
  execSync(`defaults write -g com.apple.keyboard.fnState -bool ${value}`);
  execSync(`${ACTIVATE_SETTINGS_PATH} -u`);
}

export default async function Command() {
  const currentState = getCurrentFnState();
  const newState = !currentState;

  setFnState(newState);

  const message = newState ? "Fn Keys Enabled" : "Fn Keys Disabled";

  await showHUD(message);
}
