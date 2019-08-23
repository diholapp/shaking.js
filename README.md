# DiHola Shaking API for the browser (JavaScript)

DiHola Shaking API makes it easy to build fast and reliable ways to communicate between devices, just by shaking them.
We provide such a secure and flexible protocol that this technology can be applied in any form of data exchange: Payment processing, file sharing, social networking, verification processes, etc.

**Note**: Given that motion tracking is only available in Chrome Android, the shaking event won't work in other platforms. A button can be used instead.


## Index
1. [Usage](#usage)
3. [Methods](#methods)
4. [Error Codes](#error-codes)


Usage
-------

```html
<script src="https://api.diholapplication.com/libs/shaking/1.4.0/shaking.min.js"></script>
```

```javascript

var shakingAPI = new ShakingAPI();

shakingAPI.configure({

    API_KEY: "<API_KEY>",
    user: "<USER_ID>",
    
    onShaking: () => {
      console.log("Shaking event detected");
    },
    
    onSuccess: (result) => {
      (result.length > 0)
        ? console.log("You connected with: " + result)
        : console.log("Couldn't find anyone...");
    },
    
    onError: (error) => {
      console.log(error);
    }
    
});

shakingAPI.start();

```
[Here](https://github.com/diholapp/shaking.js/blob/master/example/index.html) you can find an example.

Methods
-------

### Summary

* [`configure`](#configure)
* [`start`](#start)
* [`stop`](#stop)
* [`simulate`](#simulate)
* [`setSensibility`](#setsensibility)
* [`setDistanceFilter`](#setdistancefilter)
* [`setTimingFilter`](#settimingfilter)
* [`setKeepSearching`](#setkeepsearching)
* [`setLocation`](#setlocation)
* [`setConnectOnlyWith`](#setconnectonlywith)


### Details

#### `configure()`

```javascript
shakingAPI.configure(options);
```
 - **options**:

    | Name | Type | Default | Required | Description |
    | -- | -- | -- | -- | -- |
    | API_KEY | `string` | -- | `yes` | Get one at www.diholapp.com |
    | user | `string` | -- | `yes` |User identifier |
    | lat | `number` | Device current value | `no` | Latitude coordinates
    | lng | `number` | Device current value | `no` | Longitude coordinates
    | sensibility | `number` | `25` | `no` | Shaking sensibility
    | distanceFilter | `number` | `100` | `no` | Maximum distance (in meters) between two devices to be eligible for pairing.
    | timingFilter | `number` | `2000` | `no` | Maximum time difference (in milliseconds) between two shaking events to be eligible for pairing.
    | keepSearching | `boolean` | `false` | `no` | A positive value would allow to keep searching even though if a user has been found. This could allow to pair with multiple devices. The response time will be affected by the timingFilter value.
    | connectOnlyWith | `[String]` | `[]` | Allows to connect only with a set of users. This can be useful in processes verification.
    | vibrate | `boolean` | `true` | `no` | Vibrate on shaking.
    | onShaking | `function` | -- | `no` | Invoked when the shaking event is detected
    | onSuccess | `function` | -- | `yes` | Invoked with a list of paired users
    | onError | `function` | -- | `yes` | Invoked whenever an error is encountered


---


#### `start()`

```javascript
shakingAPI.start();
```

Starts listening to shaking events.


---

#### `stop()`

```javascript
shakingAPI.stop();
```

Stops listening to shaking events.

---

#### `simulate()`

```javascript
shakingAPI.simulate();
```

Simulates the shaking event.


---

#### `setSensibility()`

```javascript
shakingAPI.setSensibility(sensibility);
```

Sets the sensibility for the shaking event to be triggered.

**Parameters:**

| Name        | Type     | Default|
| ----------- | -------- | -------- |
| sensibility| number     | 30      |

---


#### `setDistanceFilter()`

```javascript
shakingAPI.setDistanceFilter(distanceFilter);
```

Sets the maximum distance (in meters) between two devices to be eligible for pairing.

**Parameters:**

| Name        | Type     | Default| Note|
| ----------- | -------- | -------- | ----------------------------------------- |
| distanceFilter| number     | 100  | GPS margin error must be taken into account        |

---


#### `setTimingFilter()`

```javascript
shakingAPI.setTimingFilter(timingFilter);
```

Sets the maximum time difference (in milliseconds) between two shaking events to be eligible for pairing.

**Parameters:**

| Name        | Type     | Default| Note|
| ----------- | -------- | -------- | -------- |
| timingFilter| number   | 2000 | Value between 100 and 10000 |

---

#### `setKeepSearching()`

```javascript
shakingAPI.setKeepSearching(keepSearching);
```

A positive value would allow to keep searching even though if a user has been found. This could allow to pair with multiple devices. The response time will be affected by the timingFilter value.

**Parameters:**

| Name        | Type     | Default|
| ----------- | -------- | -------- |
| keepSearching| boolean| false|

---

#### `setConnectOnlyWith()`

```java
shakingAPI.setConnectOnlyWith(users);
```

Allows to connect only with a set of users. This can be useful in processes verification.

**Parameters:**

| Name        | Type     | Default|
| ----------- | -------- | -------- |
| users| [String]| Empty|

---




#### `setLocation()`


```javascript
shakingAPI.setLocation(latitude, longitude);
```

Setting the location manually will disable using the device location.

**Parameters:**

| Name        | Type     | Default  |
| ----------- | -------- | -------- |
| latitude    | number   | Device current value|
| longitude   | number   | Device current value|



Error Codes
----------

| Name                     |  Description|
| ---------------------    |  -------- |
| LOCATION_PERMISSION_ERROR| Location permission has not been accepted|
| LOCATION_DISABLED        | Location is disabled|
| SENSOR_ERROR             | The sensor devices are not available |
| AUTHENTICATION_ERROR     | API key invalid|
| API_KEY_EXPIRED          | API key expired|
| SERVER_ERROR             | Server is not available|
  
Example:

```javascript

shakingAPI.configure({

  ...
      
  onError: (error) => {

    switch(error){
      case ShakingCodes.LOCATION_PERMISSION_ERROR:
        // Do something
        break;
      case ShakingCodes.LOCATION_DISABLED:
        // Do something
        break;
      case ShakingCodes.AUTHENTICATION_ERROR:
        // Do something
        break;
      case ShakingCodes.API_KEY_EXPIRED:
        // Do something
        break;
      case ShakingCodes.SERVER_ERROR:
        // Do something
        break;
      case ShakingCodes.SENSOR_ERROR:
        // Do something
        break;
    }

  }
      
});

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
