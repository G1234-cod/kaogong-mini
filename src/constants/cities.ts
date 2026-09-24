// 内置城市库：河南全省优先（许昌、郑州置顶），坐标手工校准，点选即用无歧义
export interface City {
  name: string
  province: string
  city?: string // 地级市名（内置城市不需要，geocode 候选的区县级结果才有）
  lat: number
  lon: number
}

export const HENAN_CITIES: City[] = [
  { name: '许昌', province: '河南', lat: 34.035, lon: 113.853 },
  { name: '郑州', province: '河南', lat: 34.747, lon: 113.625 },
  { name: '开封', province: '河南', lat: 34.797, lon: 114.308 },
  { name: '洛阳', province: '河南', lat: 34.62, lon: 112.454 },
  { name: '平顶山', province: '河南', lat: 33.767, lon: 113.193 },
  { name: '安阳', province: '河南', lat: 36.099, lon: 114.393 },
  { name: '鹤壁', province: '河南', lat: 35.748, lon: 114.297 },
  { name: '新乡', province: '河南', lat: 35.303, lon: 113.927 },
  { name: '焦作', province: '河南', lat: 35.216, lon: 113.242 },
  { name: '濮阳', province: '河南', lat: 35.762, lon: 115.03 },
  { name: '漯河', province: '河南', lat: 33.582, lon: 114.047 },
  { name: '三门峡', province: '河南', lat: 34.773, lon: 111.195 },
  { name: '南阳', province: '河南', lat: 32.991, lon: 112.531 },
  { name: '商丘', province: '河南', lat: 34.415, lon: 115.656 },
  { name: '信阳', province: '河南', lat: 32.147, lon: 114.075 },
  { name: '周口', province: '河南', lat: 33.626, lon: 114.699 },
  { name: '驻马店', province: '河南', lat: 32.98, lon: 114.023 },
  { name: '济源', province: '河南', lat: 35.067, lon: 112.602 },
]

export const OTHER_CITIES: City[] = [
  { name: '北京', province: '北京', lat: 39.904, lon: 116.407 },
  { name: '上海', province: '上海', lat: 31.23, lon: 121.474 },
  { name: '广州', province: '广东', lat: 23.129, lon: 113.264 },
  { name: '深圳', province: '广东', lat: 22.543, lon: 114.058 },
  { name: '武汉', province: '湖北', lat: 30.593, lon: 114.305 },
  { name: '西安', province: '陕西', lat: 34.342, lon: 108.94 },
  { name: '南京', province: '江苏', lat: 32.06, lon: 118.797 },
  { name: '成都', province: '四川', lat: 30.573, lon: 104.067 },
]

export const QUICK_CITIES: City[] = [...HENAN_CITIES, ...OTHER_CITIES]
