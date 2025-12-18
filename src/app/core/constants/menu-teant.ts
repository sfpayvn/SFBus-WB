import { MenuItem } from '../models/menu.model';

export class MenuTenant {
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
          route: '/management/users-management',
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Media Center',
          route: '/management/files-center-management',
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Goods Management',
          route: '/management/goods-management',
          children: [
            { label: 'Goods', route: '/management/goods-management/goods' },
            { label: 'Goods Category', route: '/management/goods-management/goods-categories' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Bus Management',
          route: '/management/bus-management',
          children: [
            {
              icon: 'assets/icons/heroicons/outline/cube.svg',
              label: 'Buses',
              route: '/management/bus-management/buses',
            },
            {
              icon: 'assets/icons/heroicons/outline/cube.svg',
              label: 'Bus Schedule',
              route: '/management/bus-management/bus-schedule',
              children: [
                {
                  label: 'Schedule Calendar',
                  route: '/management/bus-management/bus-schedule/bus-schedules/calendar',
                },
                {
                  label: 'Bus Scheduler',
                  route: '/management/bus-management/bus-schedule/bus-schedules/scheduler',
                },
                {
                  label: 'Bus Scheduler Auto',
                  route: '/management/bus-management/bus-schedule/bus-schedule-autogenerators',
                },
              ],
            },
            {
              icon: 'assets/icons/heroicons/outline/cube.svg',
              label: 'Bus Design',
              route: '/management/bus-management/bus-design',
              children: [
                { label: 'Bus Templates', route: '/management/bus-management/bus-design/bus-templates' },
                {
                  label: 'Bus Schedule Templates',
                  route: '/management/bus-management/bus-design/bus-schedule-templates',
                },
                { label: 'Bus Routes', route: '/management/bus-management/bus-design/bus-routes' },

                { label: 'Bus Layout Template', route: '/management/bus-management/bus-design/bus-layout-templates' },
              ],
            },
            {
              icon: 'assets/icons/heroicons/outline/cube.svg',
              label: 'Bus Settings',
              route: '/management/bus-management/bus-setting',
              children: [
                { label: 'Bus Provices', route: '/management/bus-management/bus-setting/bus-provinves' },
                { label: 'Bus Stations', route: '/management/bus-management/bus-setting/bus-stations' },
                { label: 'Bus Types', route: '/management/bus-management/bus-setting/bus-types' },
                { label: 'Bus Services', route: '/management/bus-management/bus-setting/bus-services' },
                { label: 'Seat Types', route: '/management/bus-management/bus-setting/seat-type' },
              ],
            },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Promotion Management',
          route: '/management/promotion-management/promotion',
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Booking Management',
          route: '/management/booking-management/booking',
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Setting',
          route: '/management/setting-management',
          children: [{ label: 'Payment Methods', route: '/management/setting-management/payment-method' }],
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
          route: '/users/list',
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
          children: [{ label: 'Theme setting', route: '/settings/theme-setting' }],
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
