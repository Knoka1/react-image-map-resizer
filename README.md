# React Image Map Resizer

[![npm version](.svg)]()
[![license: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

_This is a simple library that makes HTML Image Maps responsive, so that they automatically stay scaled to the size of the image they are attached to using a React hook and native html img and map elements. It detects the window being resized and updates the co-ordinates of the image map accordingly._

### React Usage

Include the useImageMapResize hook in your component, passing the same image map name used for the img and for the map and attach its ref to the map element. Here's an example:

```js
const mapRef = useImageMapResize("your-map-name");

<img
  src="/maps/demo_treasure_trails_map.jpg"
  useMap="#your-map-name"
  alt="Adventure Map"
  className="w-full h-auto"
/>;
<map name="your-map-name" ref={mapRef}>
  <area
    target="_self"
    alt="description"
    title="title"
    href="/"
    coords="424,777,355,711,214,746,76,1028,151,1054,617,1048"
    shape="poly"
  />
  <area
    target="_self"
    alt="description"
    title="title"
    href="/"
    coords="162,44,119,130,30,378,539,363,361,41"
    shape="poly"
  />
</map>;
```

### NextJs Usage

You can add it to your client components on NextJs. It should be used on native html img and map elements though. NextJs own <Image /> component is not supported yet.

### Credits

This is a port of the [image_map_resizer](https://github.com/davidjbradshaw/image-map-resizer) vanilla js made by @davidjbradshaw to a simple reusable hook for React applications.

### License

Copyright &copy; 2014-19 [Alec do Couto](https://github.com/knoka1) - Licensed under the [MIT license](http://opensource.org/licenses/MIT)

<!-- [![NPM]()]() -->
