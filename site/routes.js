/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-14 16:23:56
 * @LastEditTime: 2019-10-14 16:33:04
 * @LastEditors: Please set LastEditors
 */
import Layout from './components/layout.vue';
import demoRoutes from './demoRoutes';
export default [{
    path: '/components',
    component: Layout,
    props: route => {
        console.log('route', route);
        const name = route.path.split('/components/')[1].split('/')[0];
        return { name, showDemo: true };
    },
    children: demoRoutes,
}]
