export const roles = {
  admin: 'ADMIN',
  areaManager: 'AREA_MANAGER',
  owner: 'OWNER',
  driver: 'DRIVER',
  assistantDriver: 'ASSISTANT_DRIVER',
  handyman: 'HANDYMAN',
  consumer: 'CONSUMER',
};

export const roleList = [
  {value: roles.owner, label: 'Owner'},
  {value: roles.driver, label: 'Driver'},
  {value: roles.assistantDriver, label: 'Assistant Driver'},
  {value: roles.handyman, label: 'Handyman'},
  {value: roles.consumer, label: 'Passenger'},
];

export const getCurrentRole = user => {
  const rs = user?.roles || [];
  if (rs.includes(roles.admin)) {
    return roles.admin;
  }
  if (rs.includes(roles.areaManager)) {
    return roles.areaManager;
  }
  if (rs.includes(roles.owner)) {
    return roles.owner;
  }
  if (rs.includes(roles.driver)) {
    return roles.driver;
  }
  if (rs.includes(roles.assistantDriver)) {
    return roles.assistantDriver;
  }
  if (rs.includes(roles.handyman)) {
    return roles.handyman;
  }
};
