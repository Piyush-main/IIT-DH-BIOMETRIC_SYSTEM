-- =====================================================================
-- Row Level Security for direct ESP32/Raspberry Pi writes to Supabase
-- =====================================================================
-- Context: the ESP32/Pi devices write attendance records straight into
-- Supabase using their own key — NOT through this backend's Express API.
-- That means none of the checks in attendance.service.ts (professor-owns-
-- course, duplicate prevention) run for those writes. The DB-level unique
-- constraint added to the `attendance` table (courseCode, studentId,
-- sessionDate) covers duplicates. RLS is what should scope *what the
-- device is allowed to touch at all*.
--
-- Run this ONLY if the device uses the Supabase `anon` key (recommended).
-- If it uses the `service_role` key, RLS is bypassed entirely regardless
-- of these policies — switch to `anon` + a policy below before relying
-- on this for security.
-- =====================================================================

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Devices may INSERT attendance rows, but not read, update, or delete
-- other students' records, other courses, or historical data.
CREATE POLICY device_insert_attendance
  ON attendance
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Nothing else is granted to `anon` on this table — no SELECT, UPDATE,
-- or DELETE policies means those operations are denied by default once
-- RLS is enabled, even though no explicit DENY is written.

-- If a device also needs to flip `synced` after a successful sync run,
-- scope that narrowly instead of granting a blanket UPDATE:
-- CREATE POLICY device_mark_synced
--   ON attendance
--   FOR UPDATE
--   TO anon
--   USING (synced = false)
--   WITH CHECK (synced = true);

-- Students/Professors/Courses tables should NOT be writable by `anon` at
-- all (only readable, if the device needs to validate a student_id exists
-- before inserting — omit even that if the device can just let the FK
-- constraint reject an unknown student_id):
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- No policies added for `anon` on these tables = no access at all.
