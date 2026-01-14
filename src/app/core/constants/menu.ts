import { MenuItem } from '../models/menu.model';
import { MODULE_KEYS } from './module-function-keys';

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
          label: 'Users Management',
          route: '/management/users-management',
          moduleKey: MODULE_KEYS.USERS_MANAGEMENT,
          children: [
            {
              label: 'Client',
              route: '/management/users-management/client',
              moduleKey: MODULE_KEYS.USER_CLIENT,
            },
            {
              label: 'Driver',
              route: '/management/users-management/driver',
              moduleKey: MODULE_KEYS.USER_DRIVER,
            },
            {
              label: 'POS',
              route: '/management/users-management/pos',
              moduleKey: MODULE_KEYS.USER_POS,
            },
            {
              label: 'Operator',
              route: '/management/users-management/tenant-operator',
              moduleKey: MODULE_KEYS.USER_TENANT_OPERATOR,
            },
             {
              label: 'Tenant',
              route: '/management/users-management/tenant',
              moduleKey: MODULE_KEYS.USER_TENANT,
            },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Media Center',
          route: '/management/files-center-management',
          moduleKey: MODULE_KEYS.FILES_CENTER_MANAGEMENT,
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Goods Management',
          route: '/management/goods-management',
          moduleKey: MODULE_KEYS.GOODS_MANAGEMENT,
          children: [
            { label: 'Goods', route: '/management/goods-management/goods', moduleKey: MODULE_KEYS.GOODS },
            {
              label: 'Goods Category',
              route: '/management/goods-management/goods-categories',
              moduleKey: MODULE_KEYS.GOODS_CATEGORIES,
            },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Bus Management',
          route: '/management/bus-management',
          moduleKey: MODULE_KEYS.BUS_MANAGEMENT,
          children: [
            {
              icon: 'assets/icons/heroicons/outline/cube.svg',
              label: 'Buses',
              route: '/management/bus-management/buses',
              moduleKey: MODULE_KEYS.BUSES,
            },
            {
              icon: 'assets/icons/heroicons/outline/cube.svg',
              label: 'Bus Schedule',
              route: '/management/bus-management/bus-schedule',
              moduleKey: MODULE_KEYS.BUS_SCHEDULE,
              children: [
                {
                  label: 'Schedule Calendar',
                  route: '/management/bus-management/bus-schedule/bus-schedules/calendar',
                  moduleKey: MODULE_KEYS.BUS_SCHEDULE_CALENDAR,
                },
                {
                  label: 'Bus Scheduler',
                  route: '/management/bus-management/bus-schedule/bus-schedules/scheduler',
                  moduleKey: MODULE_KEYS.BUS_SCHEDULE,
                },
                {
                  label: 'Bus Scheduler Auto',
                  route: '/management/bus-management/bus-schedule/bus-schedule-autogenerators',
                  moduleKey: MODULE_KEYS.BUS_SCHEDULE_AUTOGENERATORS,
                },
              ],
            },
            {
              icon: 'assets/icons/heroicons/outline/cube.svg',
              label: 'Bus Design',
              route: '/management/bus-management/bus-design',
              moduleKey: MODULE_KEYS.BUS_DESIGN,
              children: [
                {
                  label: 'Bus Templates',
                  route: '/management/bus-management/bus-design/bus-templates',
                  moduleKey: MODULE_KEYS.BUS_TEMPLATES,
                },
                {
                  label: 'Bus Schedule Templates',
                  route: '/management/bus-management/bus-design/bus-schedule-templates',
                  moduleKey: MODULE_KEYS.BUS_SCHEDULE_TEMPLATES,
                },
                {
                  label: 'Bus Routes',
                  route: '/management/bus-management/bus-design/bus-routes',
                  moduleKey: MODULE_KEYS.BUS_ROUTES,
                },
                {
                  label: 'Bus Layout Template',
                  route: '/management/bus-management/bus-design/bus-layout-templates',
                  moduleKey: MODULE_KEYS.BUS_LAYOUT_TEMPLATES,
                },
              ],
            },
            {
              icon: 'assets/icons/heroicons/outline/cube.svg',
              label: 'Bus Settings',
              route: '/management/bus-management/bus-setting',
              moduleKey: MODULE_KEYS.BUS_SETTING,
              children: [
                {
                  label: 'Bus Provices',
                  route: '/management/bus-management/bus-setting/bus-provinves',
                  moduleKey: MODULE_KEYS.BUS_PROVINCES,
                },
                {
                  label: 'Bus Stations',
                  route: '/management/bus-management/bus-setting/bus-stations',
                  moduleKey: MODULE_KEYS.BUS_STATIONS,
                },
                {
                  label: 'Bus Types',
                  route: '/management/bus-management/bus-setting/bus-types',
                  moduleKey: MODULE_KEYS.BUS_TYPES,
                },
                {
                  label: 'Bus Services',
                  route: '/management/bus-management/bus-setting/bus-services',
                  moduleKey: MODULE_KEYS.BUS_SERVICES,
                },
                {
                  label: 'Seat Types',
                  route: '/management/bus-management/bus-setting/seat-type',
                  moduleKey: MODULE_KEYS.SEAT_TYPES,
                },
              ],
            },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Promotion Management',
          route: '/management/promotion-management/promotion',
          moduleKey: MODULE_KEYS.PROMOTION_MANAGEMENT,
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Booking Management',
          route: '/management/booking-management/booking',
          moduleKey: MODULE_KEYS.BOOKING_MANAGEMENT,
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Payment Management',
          route: '/management/payment-management',
          moduleKey: MODULE_KEYS.PAYMENT_MANAGEMENT,
          children: [
            {
              label: 'Payment Methods',
              route: '/management/payment-management/payment-method',
              moduleKey: MODULE_KEYS.PAYMENT_MANAGEMENT,
            },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Tenant Management',
          route: '/management/tenant-management/tenant',
          moduleKey: MODULE_KEYS.TENANT_MANAGEMENT,
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Subscription Management',
          route: '/management/subscription-management/subscription',
          moduleKey: MODULE_KEYS.SUBSCRIPTION_MANAGEMENT,
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
          moduleKey: MODULE_KEYS.SETTING_MANAGEMENT,
          children: [
            { label: 'Theme setting', route: '/settings/theme-setting', moduleKey: MODULE_KEYS.THEME_SETTINGS },
            {
              label: 'Bus Schedule Setting',
              route: '/settings/bus-schedule-setting',
              moduleKey: MODULE_KEYS.BUS_SCHEDULE_SETTINGS,
            },
            {
              label: 'Organization setting',
              route: '/settings/organization-setting',
              moduleKey: MODULE_KEYS.ORGANIZATION_SETTINGS,
            },
            { label: 'Default setting', route: '/settings/default-setting', moduleKey: MODULE_KEYS.DEFAULT_SETTINGS },
          ],
        },
      ],
    },
  ];
}
