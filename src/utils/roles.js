export const roles = {
  admin: 'ADMIN',
  areaManager: 'AREA_MANAGER',
  owner: 'OWNER',
  driver: 'DRIVER',
  assistantDriver: 'ASSISTANT_DRIVER',
  handyman: 'HANDYMAN',
  consumer: 'CONSUMER',
};

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
