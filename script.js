let currentMarker = null;

function startApp() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('control-panel').style.display = 'block';
}

function nextStatue() {
    if (currentMarker) {
        const markerEntity = document.querySelector(`#${currentMarker}`);
        markerEntity.setAttribute('visible', false);
        currentMarker = null;
    }
}

AFRAME.registerComponent('markerhandler', {
    init: function () {
        const marker = this.el;

        marker.addEventListener('markerFound', () => {
            currentMarker = marker.id;
            const markerEntity = document.querySelector(`#${marker.id}`);
            markerEntity.setAttribute('visible', true);
        });

        marker.addEventListener('markerLost', () => {
            if (currentMarker === marker.id) {
                const markerEntity = document.querySelector(`#${marker.id}`);
                markerEntity.setAttribute('visible', true);
            }
        });
    }
});

document.querySelectorAll('a-marker').forEach(marker => {
    marker.setAttribute('markerhandler', '');
});
