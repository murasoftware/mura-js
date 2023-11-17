import Video from './Video'

export default Video

export const ModuleConfig={
    key: 'Video',
    name: 'Video',
    component: Video,
    getQueryProps: function(){},
    getDynamicProps: function(){},
    contentypes:"*",
    excludeFromClient: false,
    isCollectionLayout: false,
    iconclass:"mi-info-circle",
    external:false
  }