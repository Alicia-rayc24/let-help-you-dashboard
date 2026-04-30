# Plan: Update Tab Colors to Nude, Red, and Green

The user wants the tabs to be nude, red, or green, and explicitly not white. I will update the navigation components and the underlying UI component to adhere to this.

## 1. Update Navigation in `src/App.tsx`
- Ensure the sidebar navigation buttons (which act as tabs) use the nude/red/green palette.
- Currently, they use nude (`#E3D5CA`) for inactive and red (`bg-red-700`) for active.
- I will maintain this but ensure the hover states also use these colors.

## 2. Update Admin Portal Tabs in `src/components/Admin.tsx`
- The tabs currently use nude (`#E3D5CA`) for inactive and green (`bg-green-700`) for active.
- I will keep this as it satisfies the requirement.

## 3. Global Tabs Styling in `src/components/ui/tabs.tsx`
- The shadcn `Tabs` component currently uses `bg-muted` (near white) and `bg-background` (white) for the active state.
- I will modify it to use the requested colors:
    - `TabsList`: `bg-[#E3D5CA]` (nude)
    - `TabsTrigger` (active): `bg-green-700` or `bg-red-700` with `text-white`
    - `TabsTrigger` (inactive): `text-slate-900` or similar dark color for contrast.

## 4. Final Review
- Verify that no white is visible on the tabs.
