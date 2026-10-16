// 生成 GeoServer SLD 样式：点按文化类别着色、省界面填充
// 颜色必须与 src/config/layers.ts 的 CATEGORY_COLORS / PROVINCE_* 保持一致
// 用法：node scripts/build-sld.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sldDir = join(root, 'sld');

// 与 src/config/layers.ts CATEGORY_COLORS 对齐
const CATEGORY_COLORS = {
  宫殿坛庙: '#c0392b',
  古典园林: '#2e7d32',
  古城古镇: '#b9770e',
  古村落: '#9c6b3f',
  宗教寺观: '#8e44ad',
  历史名山: '#148f77',
  石窟石刻: '#5d6d7e',
  古遗址: '#a04000',
  陵寝墓葬: '#616a6b',
  关隘长城: '#7b241c',
  历史街区: '#1f618d',
  复合人文: '#b7950b',
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 点图层：按 category 字段分类着色
function buildSpotsSld() {
  const rules = Object.entries(CATEGORY_COLORS)
    .map(([name, color]) => `        <Rule>
          <Name>${esc(name)}</Name>
          <Title>${esc(name)}</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>category</ogc:PropertyName>
              <ogc:Literal>${esc(name)}</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill><CssParameter name="fill">${color}</CssParameter></Fill>
                <Stroke>
                  <CssParameter name="stroke">#ffffff</CssParameter>
                  <CssParameter name="stroke-width">1.5</CssParameter>
                </Stroke>
              </Mark>
              <Size>12</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:sld="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>ancient_5a_category</Name>
    <UserStyle>
      <Title>古代类 5A 景区按文化类别着色</Title>
      <FeatureTypeStyle>
${rules}
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
`;
}

// 省界面：浅色填充 + 深灰边界
function buildProvincesSld() {
  return `<?xml version="1.0" encoding="UTF-8"?>
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
`;
}

mkdirSync(sldDir, { recursive: true });
writeFileSync(join(sldDir, 'ancient_5a_category.sld'), buildSpotsSld(), 'utf8');
writeFileSync(join(sldDir, 'provinces.sld'), buildProvincesSld(), 'utf8');
console.log(`[OK] 生成 sld/ancient_5a_category.sld（${Object.keys(CATEGORY_COLORS).length} 类规则）`);
console.log('[OK] 生成 sld/provinces.sld');
