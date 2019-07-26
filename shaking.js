function ShakingAPI() {}

ShakingAPI.prototype = {

    /*
     * Client API key.
     */
    API_KEY: "Get one at www.diholapp.com",

    /*
     * User unique identifier in the context of the app.
     */
    user: "",

    /*
     * Latitude and longitude coordinates.
     * Note: lat = lng = 0 is an invalid location.
     */
    lat: 0,
    lng: 0,

    /*
    * Sensibility for the shaking event.
    */
    sensibility: 30,

    /*
     * Maximum time (in ms) between shaking events 
     * to be elegible for pairing.
     */
    timingFilter: 2000,

    /*
     * Maximum distance (in meters) 
     * to be elegible for pairing.
     */
    distanceFilter: 100,

    /*
     * Keep searching even if a user has been found.
     * Allows to connect with multiple devices.
     */
    keepSearching: false,

    /*
     * True if the location is provided programatically,
     * otherwise the device location will be used.
     */
    manualLocation: false,

    accelerometer: null,

    /*
     * API status.
     */
    stopped: true,
    paused: false,
    processing: false,
    background: false,

    /*
     * Vibrate on shaking.
     */
    vibrate: true,


    start: function() {

        if (this.stopped) {
            
            this.stopped = false;
            this.paused = false;

            this._getCurrentPosition();
            this._subscribe();
        }
    },

    stop: function() {

        if (!this.stopped) {

            this.stopped = true;
            this.paused = false;
            this.processing = false;

            this.accelerometer && this._unsubscribe();
        }
    },

    _restart: function() {

        if (!this.stopped && !this.processing && this.paused && !this.background) {

            this.paused = false;
            this._getCurrentPosition();
            this._subscribe();
        }
    },

    _pause: function() {

        if (!this.paused) {
            this.paused = true;
            this.accelerometer && this._unsubscribe();
        }
    },

    simulate: function() {
        this._onShakingEvent();
    },

    configure: function(params) {

        const {
            API_KEY,
            user,
            lat,
            lng,
            sensibility,
            timingFilter,
            distanceFilter,
            keepSearching,
            vibrate,
            onShaking,
            onSuccess,
            onError
        } = params;

        this.API_KEY = API_KEY;
        this.user = user;

        if (sensibility !== undefined) this.setSensibility(sensibility);
        if (timingFilter !== undefined) this.setTimingFilter(timingFilter);
        if (distanceFilter !== undefined) this.setDistanceFilter(distanceFilter);
        if (keepSearching !== undefined) this.setKeepSearching(keepSearching);
        if (vibrate !== undefined) this.vibrate = vibrate;

        if (lat !== undefined && lng !== undefined) {
            this.setLocation(lat, lng);
        }

        this.onShaking = onShaking;
        this.onSuccess = onSuccess;
        this.onError = onError;

        return this;
    },

    setLocation: function(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        this.manualLocation = true;
    },

    setUser: function(user) {
        this.user = user;
    },

    setSensibility: function(sensibility) {
        this.sensibility = sensibility;
    },

    setTimingFilter: function(timingFilter) {
        this.timingFilter = timingFilter;
    },

    setDistanceFilter: function(distanceFilter) {
        this.distanceFilter = distanceFilter;
    },

    setKeepSearching: function(keepSearching) {
        this.keepSearching = keepSearching;
    },

    _subscribe: function() {

        try {

            this.accelerometer = new Accelerometer({ frequency: 60 });

            this.accelerometer.onreading = () => {

                const { x, y, z } = this.accelerometer;
                const speed = Math.abs(x) + Math.abs(y) + Math.abs(z);

                if (speed > this.sensibility) this._onShakingEvent();
            };

            this.accelerometer.onerror = () => this.onError(ShakingCodes.SENSOR_ERROR);

            this.accelerometer.start();

        } catch (e){
            if (e instanceof ReferenceError) {
                this.onError(ShakingCodes.SENSOR_ERROR);
            }
            else {
                throw e;
            };
        }
        
    },

    _unsubscribe: function() {
        this.accelerometer.stop();
    },

    _onShakingEvent: function() {
        this._pause();
        this.vibrate && navigator.vibrate(300);
        this.onShaking && this.onShaking();
        this._getCurrentPosition();
        this._connect();
    },

    _connect: function() {

        this.processing = true;

        let requestConfig = {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                api_key: this.API_KEY,
                id: this.user,
                lat: this.lat,
                lng: this.lng,
                sensibility: this.sensibility,
                distanceFilter: this.distanceFilter,
                timingFilter: this.timingFilter,
                keepSearching: this.keepSearching
            })
        }

        fetch("https://api.diholapplication.com/shaking/connect", requestConfig)
            .then(response => response.json())
            .then(result => this._handleServerResponse(result))
            .catch(err => {

                this.processing = false;
                this.onError(ShakingCodes.SERVER_ERROR);

                setTimeout(() => {
                    this._restart()
                }, 2000);

                console.log(err)
            })
    },

    _handleServerResponse: function(resp) {

        const { status, response } = resp;

        if (status.code == 200) {
            this.onSuccess(response);
        } else if (status.code == 401) {
            this.onError(ShakingCodes.AUTHENTICATION_ERROR);
        } else if (status.code == 403) {
            this.onError(ShakingCodes.API_KEY_EXPIRED);
        } else {
            this.onError(ShakingCodes.SERVER_ERROR);
        }

        this.processing = false;
        this._restart();
    },

    _getCurrentPosition: async function() {

        if (this.manualLocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            },
            (error) => {
                if (error.code === 1) {
                    this.onError(ShakingCodes.LOCATION_PERMISSION_ERROR);
                } else {
                    this.onError(ShakingCodes.LOCATION_DISABLED);
                }
            }, 
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
        );
    }

}

const ShakingCodes = {
    LOCATION_PERMISSION_ERROR: "LOCATION_PERMISSION_ERROR",
    LOCATION_DISABLED: "LOCATION_DISABLED",
    AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
    API_KEY_EXPIRED: "API_KEY_EXPIRED",
    TIMEOUT: "TIMEOUT",
    SERVER_ERROR: "SERVER_ERROR",
    SENSOR_ERROR: "SENSOR_ERROR"
}