# Sarasa UI SC web fonts

Source: `@fontpkg/sarasa-ui-sc@0.36.0`, repackaging Sarasa Gothic 0.36.0 (https://github.com/be5invis/Sarasa-Gothic).

The regular (400), semibold (600), and bold (700) TTF files were converted to WOFF2 with fonteditor-core. These are CJK/punctuation subsets; Latin characters continue to use the existing UI fonts. The subset family is renamed `Sarasa UI SC Web`. Copyright and SIL OFL 1.1 are retained in OFL.txt and shipped in public/font-licenses/SarasaUI-OFL.txt.

Each weight has a small common subset covering Chinese characters used in the UI source, and remaining glyphs in Unicode-range chunks of up to 2048 characters. This avoids loading the full font for ordinary navigation while retaining less common Chinese characters for user-defined UI labels.

Body content and exported documents use their separate font rules.
