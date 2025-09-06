import { OPENAI_API_KEY } from "$env/static/private";
import type { Actions } from "./$types";

export const actions: Actions = {
  startSession: async () => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/realtime/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-realtime-preview-2024-06-03",
            voice: "verse",
          }),
        },
      );

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error };
    }
  }
};
