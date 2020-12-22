import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Modeler from '@/edit-modeler/components/Modeler'
import Viewer from '@/edit-modeler/components/Viewer'
import ProcessDesign from '@/edit-modeler/ProcessDesign'
import ActExtAPI from '@/actext/actextapi'
import Index from '@/Index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/edit-modeler/modeler',
      name: 'Modeler',
      component: Modeler

    },
    {
      path: '/edit-modeler/viewer',
      name: 'Viewer',
      component: Viewer

    },
    {
      path: '/edit-modeler/ProcessDesign',
      name: 'ProcessDesign',
      component: ProcessDesign
    },
    {
      path: '/actextapi',
      name: 'ActExtAPI',
      component: ActExtAPI
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/',
      name: 'Index',
      component: Index
    },
  ]
})
