import {NsGraph} from '@antv/xflow';
import {ModalFormProps} from '@/app.d';
import {CDCParams, STEP_ATTR_TYPE} from '../../constant';
import {WsDiJobService} from '@/services/project/WsDiJobService';
import {Button, Drawer, Form, message} from 'antd';
import {WsDiJob} from '@/services/project/typings';
import {getIntl, getLocale} from 'umi';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {useEffect} from 'react';
import {InfoCircleOutlined} from "@ant-design/icons";
import {StepSchemaService} from "@/pages/Project/Workspace/Job/DI/DiJobFlow/Dag/steps/helper";
import {DictDataService} from "@/services/admin/dictData.service";
import {DICT_TYPE} from "@/constant";

const SourceCDCMySQLStepForm: React.FC<ModalFormProps<{
  node: NsGraph.INodeConfig;
  graphData: NsGraph.IGraphData;
  graphMeta: NsGraph.IGraphMeta;
}>> = ({data, visible, onCancel, onOK}) => {
  const nodeInfo = data.node.data;
  const jobInfo = data.graphMeta.origin as WsDiJob;
  const jobGraph = data.graphData;
  const intl = getIntl(getLocale(), true);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue(STEP_ATTR_TYPE.stepTitle, nodeInfo.data.displayName);
  }, []);

  return (
    <Drawer
      open={visible}
      title={nodeInfo.data.displayName}
      width={780}
      bodyStyle={{overflowY: 'scroll'}}
      destroyOnClose={true}
      onClose={onCancel}
      extra={
        <Button
          type="primary"
          onClick={() => {
            form.validateFields().then((values) => {
              let map: Map<string, any> = new Map();
              map.set(STEP_ATTR_TYPE.jobId, jobInfo.id);
              map.set(STEP_ATTR_TYPE.jobGraph, JSON.stringify(jobGraph));
              map.set(STEP_ATTR_TYPE.stepCode, nodeInfo.id);
              StepSchemaService.formatDebeziumProperties(values);
              map.set(STEP_ATTR_TYPE.stepAttrs, values);
              WsDiJobService.saveStepAttr(map).then((resp) => {
                if (resp.success) {
                  message.success(intl.formatMessage({id: 'app.common.operate.success'}));
                  onOK ? onOK(values) : null;
                }
              });
            });
          }}
        >
          {intl.formatMessage({id: 'app.common.operate.confirm.label'})}
        </Button>
      }
    >
      <ProForm form={form} initialValues={nodeInfo.data.attrs} grid={true} submitter={false}>
        <ProFormText
          name={STEP_ATTR_TYPE.stepTitle}
          label={intl.formatMessage({id: 'pages.project.di.step.stepTitle'})}
          rules={[{required: true}, {max: 120}]}
        />
        <ProFormText
          name={CDCParams.hostname}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.hostname'})}
          rules={[{required: true}]}
          colProps={{span: 16}}
        />
        <ProFormDigit
          name={CDCParams.port}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.port'})}
          rules={[{required: true}]}
          colProps={{span: 8}}
          initialValue={3306}
        />
        <ProFormText
          name={CDCParams.username}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.username'})}
          rules={[{required: true}]}
          colProps={{span: 12}}
        />
        <ProFormText
          name={CDCParams.password}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.password'})}
          rules={[{required: true}]}
          colProps={{span: 12}}
        />
        <ProFormText
          name={CDCParams.database}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.database'})}
          rules={[{required: true}]}
          colProps={{span: 12}}
        />
        <ProFormText
          name={CDCParams.table}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.table'})}
          rules={[{required: true}]}
          colProps={{span: 12}}
        />
        <ProFormSelect
          name={'startupMode'}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.startupMode'})}
          allowClear={false}
          initialValue={'initial'}
          options={['initial', 'earliest', 'latest', 'specific', 'timestamp']}
        />
        <ProFormDependency name={['startupMode']}>
          {({startupMode}) => {
            if (startupMode == 'timestamp') {
              return (
                <ProFormGroup>
                  <ProFormDigit
                    name={CDCParams.startupTimestamp}
                    label={intl.formatMessage({
                      id: 'pages.project.di.step.cdc.startupTimestamp',
                    })}
                    rules={[{required: true}]}
                  />
                </ProFormGroup>
              );
            } else if (startupMode == 'specific') {
              return (
                <ProFormGroup>
                  <ProFormText
                    name={CDCParams.startupSpecificOffsetFile}
                    label={intl.formatMessage({
                      id: 'pages.project.di.step.cdc.startupSpecificOffsetFile',
                    })}
                    rules={[{required: true}]}
                    colProps={{span: 12}}
                  />
                  <ProFormText
                    name={CDCParams.startupSpecificOffsetPos}
                    label={intl.formatMessage({
                      id: 'pages.project.di.step.cdc.startupSpecificOffsetPos',
                    })}
                    rules={[{required: true}]}
                    colProps={{span: 12}}
                  />
                </ProFormGroup>
              );
            }
            return <ProFormGroup/>;
          }}
        </ProFormDependency>

        <ProFormSelect
          name={'stopMode'}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.stopMode'})}
          allowClear={false}
          initialValue={'never'}
          options={['never', 'latest', 'specific', 'timestamp']}
        />
        <ProFormDependency name={['stopMode']}>
          {({stopMode}) => {
            if (stopMode == 'timestamp') {
              return (
                <ProFormGroup>
                  <ProFormDigit
                    name={CDCParams.stopTimestamp}
                    label={intl.formatMessage({
                      id: 'pages.project.di.step.cdc.stopTimestamp',
                    })}
                    rules={[{required: true}]}
                  />
                </ProFormGroup>
              );
            } else if (stopMode == 'specific') {
              return (
                <ProFormGroup>
                  <ProFormText
                    name={CDCParams.stopSpecificOffsetFile}
                    label={intl.formatMessage({
                      id: 'pages.project.di.step.cdc.stopSpecificOffsetFile',
                    })}
                    rules={[{required: true}]}
                    colProps={{span: 12}}
                  />
                  <ProFormText
                    name={CDCParams.stopSpecificOffsetPos}
                    label={intl.formatMessage({
                      id: 'pages.project.di.step.cdc.stopSpecificOffsetPos',
                    })}
                    rules={[{required: true}]}
                    colProps={{span: 12}}
                  />
                </ProFormGroup>
              );
            }
            return <ProFormGroup/>;
          }}
        </ProFormDependency>
        <ProFormDigit
          name={CDCParams.snapshotSplitSize}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.snapshotSplitSize'})}
          colProps={{span: 8}}
          initialValue={8096}
          fieldProps={{
            step: 1024,
            min: 1,
          }}
        />
        <ProFormDigit
          name={CDCParams.snapshotFetchSize}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.snapshotFetchSize'})}
          colProps={{span: 8}}
          initialValue={1024}
          fieldProps={{
            step: 1024,
            min: 1,
          }}
        />
        <ProFormDigit
          name={CDCParams.incrementalParallelism}
          label={intl.formatMessage({
            id: 'pages.project.di.step.cdc.incrementalParallelism',
          })}
          colProps={{span: 8}}
          initialValue={1}
          fieldProps={{
            min: 0,
          }}
        />
        <ProFormText
          name={CDCParams.serverId}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.serverId'})}
          colProps={{span: 12}}
        />
        <ProFormText
          name={CDCParams.serverTimeZone}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.serverTimeZone'})}
          colProps={{span: 12}}
          initialValue={'UTC'}
        />
        <ProFormDigit
          name={CDCParams.connectionPoolSize}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.connectionPoolSize'})}
          colProps={{span: 8}}
          initialValue={20}
          fieldProps={{
            min: 1,
          }}
        />
        <ProFormText
          name={CDCParams.connectTimeout}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.connectTimeout'})}
          colProps={{span: 8}}
          initialValue={'30s'}
        />
        <ProFormDigit
          name={CDCParams.connectMaxRetries}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.connectMaxRetries'})}
          colProps={{span: 8}}
          initialValue={3}
          fieldProps={{
            min: 0,
          }}
        />

        <ProFormDigit
          name={CDCParams.chunkKeyEvenDistributionFactorLowerBound}
          label={intl.formatMessage({
            id: 'pages.project.di.step.cdc.chunkKeyEvenDistributionFactorLowerBound',
          })}
          colProps={{span: 12}}
          initialValue={0.05}
          fieldProps={{
            min: 0,
          }}
        />
        <ProFormDigit
          name={CDCParams.chunkKeyEvenDistributionFactorUpperBound}
          label={intl.formatMessage({
            id: 'pages.project.di.step.cdc.chunkKeyEvenDistributionFactorUpperBound',
          })}
          colProps={{span: 12}}
          initialValue={1000}
          fieldProps={{
            min: 0,
          }}
        />
        <ProFormGroup
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.debeziums'})}
          tooltip={{
            title: intl.formatMessage({id: 'pages.project.di.step.cdc.debeziums.tooltip'}),
            icon: <InfoCircleOutlined/>,
          }}
        >
          <ProFormList
            name={CDCParams.debeziumProperties}
            copyIconProps={false}
            creatorButtonProps={{
              creatorButtonText: intl.formatMessage({
                id: 'pages.project.di.step.cdc.debeziums.list',
              }),
              type: 'text',
            }}
          >
            <ProFormGroup>
              <ProFormText
                name={CDCParams.debeziumProperty}
                label={intl.formatMessage({
                  id: 'pages.project.di.step.cdc.debeziums.property',
                })}
                placeholder={intl.formatMessage({
                  id: 'pages.project.di.step.cdc.debeziums.property.placeholder',
                })}
                colProps={{span: 10, offset: 1}}
              />
              <ProFormText
                name={CDCParams.debeziumValue}
                label={intl.formatMessage({id: 'pages.project.di.step.cdc.debeziums.value'})}
                placeholder={intl.formatMessage({
                  id: 'pages.project.di.step.cdc.debeziums.value.placeholder',
                })}
                colProps={{span: 10, offset: 1}}
              />
            </ProFormGroup>
          </ProFormList>
        </ProFormGroup>
        <ProFormSelect
          name={CDCParams.format}
          label={intl.formatMessage({id: 'pages.project.di.step.cdc.format'})}
          initialValue={"DEFAULT"}
          request={() => {
            return DictDataService.listDictDataByType2(DICT_TYPE.seatunnelCDCFormat)
          }}
        />
      </ProForm>
    </Drawer>
  );
};

export default SourceCDCMySQLStepForm;
