<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <NamedLayer>
    <Name>provinces</Name>
    <UserStyle>
      <Title>省级行政区面</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>province</Name>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#faf7f2</CssParameter>
              <CssParameter name="fill-opacity">0.2</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#786450</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
