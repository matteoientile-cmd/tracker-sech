import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://esnsjcdihtscdhdapobe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbnNqY2RpaHRzY2RoZGFwb2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTc3MjUsImV4cCI6MjA4NTUzMzcyNX0.5vFjeP0iMIr5huvNIi_2vqF7Qe8n5yAEtOvZ7hUrCUw"
)
