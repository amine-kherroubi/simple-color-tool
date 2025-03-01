'use strict';

/**
 * DOM Elements
 */
const hexInput = document.getElementById('hex-input');
const inputColor = document.getElementById('input-color');
const alteredColor = document.getElementById('altered-color');
const alteredColorLabel = document.getElementById('altered-color-label');
const slider = document.getElementById('slider');
const sliderLabel = document.getElementById('slider-label');

/**
 * Event listener for hex input
 */
hexInput.addEventListener('keyup', () => {
    const hex = hexInput.value;

    if (isValidHex(hex)) {
        inputColor.style.backgroundColor = hex;
        alteredColor.style.backgroundColor = hex;
        alteredColorLabel.innerText = `Altered Color: ${hex}`;
    } else {
        inputColor.style.backgroundColor = '#ffffff';
        alteredColor.style.backgroundColor = '#ffffff';
        alteredColorLabel.innerText = 'Altered Color: #ffffff';
    }

    slider.value = 100;
    sliderLabel.textContent = "100%";
});

/**
 * Event listener for slider
 */
slider.addEventListener('input', () => {
    sliderLabel.textContent = `${slider.value}%`;

    if (isValidHex(hexInput.value)) {
        const alteredHex = alterColor(hexInput.value, slider.value);
        alteredColor.style.backgroundColor = alteredHex;
        alteredColorLabel.innerText = `Altered Color: ${alteredHex}`;
    }
});

/**
 * Event listener for copying altered color to clipboard
 */
alteredColor.addEventListener('click', () => {
    if (isValidHex(hexInput.value)) {
        navigator.clipboard.writeText(alterColor(hexInput.value, slider.value));
    }
});

/**
 * Validates a hex color code
 * @param {string} hex - The hex color string
 * @returns {boolean} - True if valid, otherwise false
 */
const isValidHex = hex => /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);

/**
 * Converts a hex color to RGB
 * @param {string} hex - The hex color string
 * @returns {{r: number, g: number, b: number} | null} - RGB object or null if invalid
 */
const convertHexToRGB = hex => {
    if (isValidHex(hex)) {
        let strippedHex = hex.replace('#', '');

        if (strippedHex.length === 3) {
            strippedHex = strippedHex[0] + strippedHex[0] +
                          strippedHex[1] + strippedHex[1] +
                          strippedHex[2] + strippedHex[2];
        }

        return {
            r: parseInt(strippedHex.substring(0, 2), 16),
            g: parseInt(strippedHex.substring(2, 4), 16),
            b: parseInt(strippedHex.substring(4, 6), 16)
        };
    }
    return null;
};

/**
 * Converts an RGB color to hex
 * @param {{r: number, g: number, b: number}} rgb - RGB object
 * @returns {string | null} - Hex color string or null if invalid
 */
const convertRGBtoHex = ({ r, g, b } = {}) => {
    if ([r, g, b].every(color => Number.isInteger(color) && color >= 0 && color < 256)) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return null;
};

/**
 * Clamps a number within 0-255 range
 * @param {number} number - The original number
 * @param {number} amount - The amount to add/subtract
 * @returns {number} - Clamped number within range
 */
const increaseWithin0To255 = (number, amount) => Math.min(255, Math.max(0, number + amount));

/**
 * Alters a color based on slider value
 * @param {string} hex - The original hex color
 * @param {number} value - The slider value (0-200)
 * @returns {string} - The altered hex color
 */
const alterColor = (hex, value) => {
    const rgb = convertHexToRGB(hex);
    if (!rgb) return hex;

    const amount = Math.floor(((value - 100) / 100) * 255);

    return convertRGBtoHex({
        r: increaseWithin0To255(rgb.r, amount),
        g: increaseWithin0To255(rgb.g, amount),
        b: increaseWithin0To255(rgb.b, amount)
    });
};