import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzsvktauttmefsplqhba.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6c3ZrdGF1dHRtZWZzcGxxaGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTIxMTgsImV4cCI6MjA3MjMyODExOH0.3VLUzniqNzBkQiL49HoF1w5fh9AE6DBZPTl5bhrOlVA'; // Vá em Settings > API para copiar

export const supabase = createClient(supabaseUrl, supabaseKey);