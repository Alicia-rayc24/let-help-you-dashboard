# Plan: Add Profile Photo Attachment in Admin Portal

## Goal
Integrate a profile photo attachment field when adding or editing members in the Admin component.

## Changes
1. **Update State**: Add `photo` property to `newMember` and `editingMember` states in `Admin.tsx`.
2. **Handle File Upload**: Implement `handlePhotoChange` to read the selected file and convert it to a data URL for preview and storage.
3. **UI Update**:
    - Add a file input field in the member registration/edit card.
    - Add a circular preview area for the selected photo.
    - Style the input to match the theatre/glassmorphism theme.
    - Add a thumbnail in the member list table for visual verification.
4. **Data Integration**: Ensure the `photo` field is included in the `addMember` and `updateMember` calls.

## Technical Details
- Use `FileReader` API for local preview.
- Use `lucide-react` for the upload icon.
- Maintain existing Tailwind/Shadcn styles.
- Preserve all existing member fields.
