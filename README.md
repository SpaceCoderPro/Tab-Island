# Tab-Island

A Zen Browser/Firefox customization that creates Opera-style grouped "tab islands" for better tab organization and visual management.

## Project Overview

Tab-Island is a browser customization that transforms your tab bar into visually distinct islands, grouping related tabs together in an organized and aesthetically pleasing manner. Inspired by Opera's tab island concept, this mod provides a modern, glass-morphism design with smooth animations and configurable preferences.

## Features

- **Tab Island Shelf Container**: Automatically injects a dedicated shelf container for tab islands
- **Inline Styling**: Built-in CSS with glass-morphism effects and modern design
- **Hover Effects**: Smooth scale animations on hover for better interactivity
- **Configurable Preferences**: Customizable settings for arrows, backgrounds, borders, and tab-range display
- **Zen Integration**: Seamlessly integrates with Zen Browser's tab-group UI system
- **Responsive Design**: Flexible layout that adapts to different screen sizes

## Files & Structure

```
tab-island/
├── tab-islands.uc.js    # Core JavaScript module for tab island functionality
├── userChrome.css       # Additional styling for tab islands
├── theme.json          # Theme configuration and metadata
├── preferences.json     # Browser preference overrides
└── README.md           # This documentation file
```

### Core Components

- **tab-islands.uc.js**: The main JavaScript module that waits for browser initialization, injects the Tab Island shelf container, and applies inline styling and hover effects.
- **userChrome.css**: Provides additional CSS styling for tab islands, including backgrounds, borders, and typography.
- **theme.json**: Configuration file that defines the theme metadata and references the JS and CSS files.
- **preferences.json**: Contains browser preference settings that control the Zen tab-group UI options.

## Installation

### Prerequisites

- Zen Browser or Firefox with userChrome support
- Basic understanding of browser customization files

### Step-by-Step Installation

1. **Download or clone** the Tab-Island project files to your local machine.

2. **Locate your browser's profile directory**:
   - For Firefox/Zen Browser, typically found in:
     - Windows: `%APPDATA%\Mozilla\Firefox\Profiles\`
     - macOS: `~/Library/Application Support/Firefox/Profiles/`
     - Linux: `~/.mozilla/firefox/`

3. **Create the chrome directory** (if it doesn't exist):
   ```bash
   mkdir -p /path/to/your/profile/chrome
   ```

4. **Copy the files** to your profile's chrome directory:
   - `tab-islands.uc.js` → `chrome/tab-islands.uc.js`
   - `userChrome.css` → `chrome/userChrome.css`

5. **Enable userChrome.css** (if not already enabled):
   - Navigate to `about:config` in your browser
   - Set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`

6. **Import preferences** (optional):
   - Open `about:config`
   - Import the settings from `preferences.json` or set them manually

7. **Restart your browser** to apply the changes.

## Configuration

The Tab-Island customization can be configured through the `preferences.json` file:

### Available Settings

| Preference | Type | Default | Description |
|------------|------|---------|-------------|
| `tab.groups.add-arrow` | Boolean | `true` | Adds navigation arrows between tab groups |
| `tab.groups.background` | String | `"island"` | Sets the background style for tab islands |
| `tab.groups.borders` | Boolean | `true` | Enables borders around tab islands |
| `tab.groups.display-tab-range` | Boolean | `true` | Shows tab range information (e.g., "1-3 tabs") |

### Modifying Preferences

You can modify these preferences by:

1. **Editing preferences.json** before installation
2. **Using about:config** to override individual settings
3. **Creating a custom user.js** file in your profile directory

## Requirements

- **Zen Browser** (recommended) or **Firefox** with userChrome support
- Firefox version supporting userChrome customization
- `toolkit.legacyUserProfileCustomizations.stylesheets` preference enabled

## Usage

Once installed, Tab-Island will automatically:

1. **Initialize** when the browser starts up
2. **Create** the tab island shelf container
3. **Apply** styling and hover effects
4. **Group** tabs based on Zen's tab-group functionality

### Basic Usage

- Tabs are automatically grouped into islands based on Zen Browser's tab-group system
- Hover over islands to see smooth scale animations
- Use navigation arrows (if enabled) to navigate between groups
- Islands display tab range information (if enabled)

## Customization

### Styling

You can customize the appearance by modifying:
- **Inline CSS** in `tab-islands.uc.js` (lines 10-41)
- **External CSS** in `userChrome.css`

### JavaScript Behavior

The core functionality can be extended by modifying:
- **Initialization logic** in `tab-islands.uc.js` (lines 2-8)
- **DOM creation** in `tab-islands.uc.js` (lines 46-64)

## License

This project is open source. Please check the repository for specific licensing information or contact the author for usage rights.

## Author

**Samyak** - Initial development and maintenance

## Version

Current version: **1.0.0**

## Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests to improve the Tab-Island customization.

## Troubleshooting

### Common Issues

1. **Tab islands not appearing**:
   - Ensure `toolkit.legacyUserProfileCustomizations.stylesheets` is set to `true`
   - Verify files are placed in the correct chrome directory
   - Restart browser after installation

2. **Styling issues**:
   - Check for conflicts with other userChrome customizations
   - Verify CSS syntax in both files

3. **Performance issues**:
   - The customization uses lightweight CSS transitions
   - JavaScript only runs during initialization

### Getting Help

If you encounter issues not covered here, please:
1. Check your browser's error console (Ctrl+Shift+J)
2. Verify all files are correctly placed
3. Ensure browser compatibility requirements are met