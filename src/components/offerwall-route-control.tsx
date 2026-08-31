const OFFERWALL_ROUTE_CONTROL = `
  window.googlefc = window.googlefc || {};
  window.googlefc.controlledMessagingFunction = function (message) {
    var isExamStartPage = /^\\/exams\\/[^/]+\\/start\\/?$/.test(window.location.pathname);

    if (isExamStartPage) {
      message.proceed(true);
      return;
    }

    message.proceed(false, [window.googlefc.MessageTypeEnum.OFFERWALL]);
  };
`;

export function OfferwallRouteControl() {
  return (
    <script
      id="offerwall-route-control"
      dangerouslySetInnerHTML={{ __html: OFFERWALL_ROUTE_CONTROL }}
    />
  );
}
