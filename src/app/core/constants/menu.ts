import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          children: [
            { label: 'Nfts', route: '/dashboard/nfts' },
            { label: 'Podcast', route: '/dashboard/podcast' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
            { label: 'Two Steps', route: '/auth/two-steps' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
          label: 'Errors',
          route: '/errors',
          children: [
            { label: '404', route: '/errors/404' },
            { label: '500', route: '/errors/500' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Users',
          route: '/management/users'
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Buses',
          route: '/bus-management/buses',
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Bus Schedule',
          route: '/bus-management/bus-schedule',
          children: [
            { label: 'Schedule Calendar', route: '/bus-management/bus-schedule/bus-schedules' },
            { label: 'Bus Scheduler', route: '/bus-management/bus-schedule/bus-schedule-templates' },
            { label: 'Bus Scheduler Auto', route: '/bus-management/bus-schedule/bus-schedule-autogenerators' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Bus Design',
          route: '/bus-management/bus-design',
          children: [
            { label: 'Bus Templates', route: '/bus-management/bus-design/bus-templates' },
            { label: 'Bus Routes', route: '/bus-management/bus-design/bus-routes' },

            { label: 'Bus Layout', route: '/bus-management/bus-design/bus-layout-templates' },

          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Bus Settings',
          route: '/bus-management/bus-setting',
          children: [
            { label: 'Bus Provices', route: '/bus-management/bus-setting/bus-provinves' },
            { label: 'Bus Stations', route: '/bus-management/bus-setting/bus-stations' },
            { label: 'Bus Types', route: '/bus-management/bus-setting/bus-types' },
            { label: 'Bus Services', route: '/bus-management/bus-setting/bus-services' },
            { label: 'Seat Types', route: '/bus-management/bus-setting/seat-type' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Media Center',
          route: '/management/media-center',
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Components',
          route: '/components',
          children: [{ label: 'Table', route: '/components/table' }],
        },
      ],
    },
    {
      group: 'Collaboration',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/download.svg',
          label: 'Download',
          route: '/download',
        },
        {
          icon: 'assets/icons/heroicons/outline/gift.svg',
          label: 'Gift Card',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Users',
          route: '/users',
        },
      ],
    },
    {
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Settings',
          route: '/settings',
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notifications',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Folders',
          route: '/folders',
          children: [
            { label: 'Current Files', route: '/folders/current-files' },
            { label: 'Downloads', route: '/folders/download' },
            { label: 'Trash', route: '/folders/trash' },
          ],
        },
      ],
    },
  ];
}
