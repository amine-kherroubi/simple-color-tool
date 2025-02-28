'use strict'

// DOM elements declarations
const hexInput = window.document.getElementById('hex-input');
const inputColor = window.document.getElementById('input-color');
const alteredColor = window.document.getElementById('altered-color');
const alteredColorLabel = window.document.getElementById('altered-color-label');
const slider = window.document.getElementById('slider');
const sliderLabel = window.document.getElementById('slider-label');

// Event listeners
hexInput.addEventListener('keyup', () => {
    const hex = hexInput.value;

    if (isValidHex(hex)) {
        inputColor.style.backgroundColor = hex;
        alteredColor.style.backgroundColor = hex;
    } else {
        inputColor.style.backgroundColor = '#ffffff';
        alteredColor.style.backgroundColor = '#ffffff';
    }

    slider.value = 100;
    sliderLabel.textContent = "100%";
});

slider.addEventListener('input', () => {
    sliderLabel.textContent = `${slider.value}%`

    if (isValidHex(hexInput.value)) {
        const alteredHex = alterColor(hexInput.value, slider.value);
        alteredColor.style.backgroundColor = alteredHex;
        alteredColorLabel.innerText = `Altered Color: ${alteredHex}`
    }
});

alteredColor.addEventListener('click', () => {
    if (isValidHex(hexInput.value)) {
        navigator.clipboard.writeText(alterColor(hexInput.value, slider.value));
    }
});

// Color manipulation functions
const isValidHex = hex => /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);

const convertHexToRGB = hex => {
    if (isValidHex(hex)) {
        let strippedHex = hex.replace('#', '');

        if (strippedHex.length === 3) {
            strippedHex = strippedHex[0] + strippedHex[0]
                + strippedHex[1] + strippedHex[1]
                + strippedHex[2] + strippedHex[2];
        }

        const r = parseInt(strippedHex.substring(0, 2), 16);
        const g = parseInt(strippedHex.substring(2, 4), 16);
        const b = parseInt(strippedHex.substring(4, 6), 16);

        return { r, g, b };
    } else return null;
};

const convertRGBtoHex = ({ r, g, b } = {}) => {
    if ([r, g, b].every(color => Number.isInteger(color) && color >= 0 && color < 256)) {
        return '#' + r.toString(16).padStart(2, '0')
            + g.toString(16).padStart(2, '0')
            + b.toString(16).padStart(2, '0');
    } else return null;
};

const increaseWith0To255 = (number, amount) => Math.min(255, Math.max(0, number + amount));

const alterColor = (hex, value) => {
    const { r, g, b } = convertHexToRGB(hex);

    const amount = Math.floor(((value - 100) / 100) * 255);

    const alteredR = increaseWith0To255(r, amount);
    const alteredG = increaseWith0To255(g, amount);
    const alteredB = increaseWith0To255(b, amount);

    return convertRGBtoHex({ r: alteredR, g: alteredG, b: alteredB });
};