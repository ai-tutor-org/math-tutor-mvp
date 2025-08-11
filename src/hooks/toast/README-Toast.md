# Toast Notifications

Simple, platform-wide notifications for user feedback.

## Quick Usage

### In React Components

```jsx
import { useToast } from './src/hooks';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save. Please try again.');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Outside Components (Utils/Services)

```jsx
import { notificationService } from './src/services';

// Works anywhere in your app
notificationService.showSuccess('Operation completed!');
notificationService.showError('Something went wrong');
notificationService.showWarning('Please check your input');
notificationService.showInfo('Here is some helpful information');
```

## Toast Types

- **Success** (Green): `showSuccess('Great job!')` - For completed actions
- **Error** (Red): `showError('Something failed')` - For errors and failures  
- **Warning** (Yellow): `showWarning('Check this')` - For cautions and validation
- **Info** (Blue): `showInfo('Good to know')` - For general information

## Configuration

All toasts automatically:
- Display for **5 seconds**
- Appear at **top-right** of screen
- Slide in **horizontally from right**
- Use **dark theme** matching your app
- Handle **text overflow** with ellipsis

## Common Patterns

### Form Validation
```jsx
if (!email) {
  showWarning('Email is required');
  return;
}
```

### Async Operations
```jsx
try {
  const result = await apiCall();
  showSuccess('Operation completed!');
} catch (error) {
  showError('Operation failed. Please try again.');
}
```

### Lesson/Game Feedback
```jsx
// Correct answer
showSuccess('🎉 Correct! Well done!');

// Incorrect answer  
showWarning('Try again! Look more carefully.');

// Lesson complete
showSuccess('Lesson completed! Moving to next chapter.');
```

## Import Paths

```jsx
// Hooks (for React components) - Use barrel export
import { useToast } from './src/hooks';

// Direct import (alternative)
import { useToast } from './src/hooks/toast/useToast';

// Service (for utilities/services)
import { notificationService } from './src/services';

// Provider (only needed in App.jsx - already set up)
import { ToastProvider } from './src/components';
```

## Notes

- ✅ **Global system** - Available everywhere in your app
- ✅ **No setup needed** - Already configured in App.jsx
- ✅ **Queue management** - Handles multiple notifications automatically
- ✅ **Error-safe** - Won't crash your app if it fails
- ✅ **Cross-browser** - Works on all modern browsers 