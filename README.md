# Tab-Island

**A browser extension for Zen Browser/Firefox that creates Opera-style grouped "tab islands" for better tab organization and visual management.**

> **🚀 Seeking Help with Extension Packaging!**  
> This project needs to be properly packaged as a distributable browser extension. If you have experience with Firefox/Chrome extension development, please reach out!

## Project Overview

Tab-Island is a browser extension that transforms your tab bar into visually distinct islands, grouping related tabs together in an organized and aesthetically pleasing manner. Inspired by Opera's tab island concept, this mod provides a modern, glass-morphism design with smooth animations and configurable preferences.

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

### Testing (Temporary)

1. **Download** the Tab-Island project files to your local machine.
2. **Open Firefox** and navigate to `about:debugging`
3. **Click "This Firefox"** → **"Load Temporary Add-on"**
4. **Select** the project's manifest file or any file from the extension directory
5. **Tab-Island** will be installed temporarily for testing

### Distribution

The extension needs proper packaging for distribution through Firefox Add-ons or Chrome Web Store. See "Contributing" section if you can help with this.

## Configuration

The Tab-Island extension can be configured through the `preferences.json` file:

### Available Settings

| Preference | Type | Default | Description |
|------------|------|---------|-------------|
| `tab.groups.add-arrow` | Boolean | `true` | Adds navigation arrows between tab groups |
| `tab.groups.background` | String | `"island"` | Sets the background style for tab islands |
| `tab.groups.borders` | Boolean | `true` | Enables borders around tab islands |
| `tab.groups.display-tab-range` | Boolean | `true` | Shows tab range information (e.g., "1-3 tabs") |

### Modifying Preferences

Edit the `preferences.json` file before loading the extension, or modify settings through the extension's options page (once implemented).

## Requirements

- **Zen Browser** (recommended) or **Firefox** with extension support
- Firefox version supporting WebExtensions API

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

### 🎯 Priority: Extension Packaging

**We need help properly packaging this as a browser extension!** If you have experience with:

- Firefox WebExtensions API
- Chrome Extension Manifest V3
- Browser addon development

**Please reach out - your help would make this project accessible to many more users!**

### Other Contributions

- Bug fixes and improvements
- Documentation enhancements  
- Feature suggestions
- Testing across browsers

## Troubleshooting

### Common Issues

1. **Extension not loading**:
   - Check browser console (Ctrl+Shift+J) for errors
   - Ensure all extension files are present
   - Verify manifest.json syntax

2. **Tab islands not appearing**:
   - Restart browser after installation
   - Check for conflicts with other tab extensions

3. **Styling issues**:
   - Check browser console for CSS errors
   - Verify no conflicting extensions