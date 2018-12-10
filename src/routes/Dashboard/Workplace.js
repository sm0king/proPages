import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Row, Col, Card, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { userInfo } from '../../utils/storage';
import styles from './Workplace.less';


@connect(({ project, global }) => ({
  project,
  global,
}))
export default class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    if (!match.params.projectId) {
      if (userInfo.getDefaltPro() && (userInfo.getDefaltPro() !== 'undefined')) {
        dispatch(routerRedux.push(`/dashboard/workplace/${userInfo.getDefaltPro()}`));
      } else {
        dispatch(routerRedux.push('/project'));
      }
    } else {
      userInfo.setDefaltPro(match.params.projectId);
      dispatch({
        type: 'project/getWorkList',
        params: {
          id: match.params.projectId,
        },
      });
    }
  }

  render() {
    const { project } = this.props;
    const notice = project ? project.workList : [];
    notice.push({
      createBy: 1,
      isDelete: 1,
      menuId: 90,
      menuName: "历史数据",
      menuStatus: 1,
      menuUrl: "/historyData",
      parentId: 0,
      updateBy: null,
    });
    const projectName = userInfo.getDefaltProName();

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{projectName}</div>
          <div>基于云服务器的路灯控制</div>
        </div>
      </div>
    );
    const logUrl = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
      // extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              {
                notice.map(item => (
                  <Card.Grid className={styles.projectGrid} key={item.menuId}>
                    <Card bodyStyle={{ padding: 0 }} bordered={false}>
                      <Card.Meta
                        title={(
                          <Link to={item.menuUrl} className={styles.cardTitle}>
                            <Avatar size={64} src={item.logo || logUrl} />
                            <div>{item.menuName}</div>
                          </Link>
                        )}
                      />
                    </Card>
                  </Card.Grid>
                ))
              }
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
