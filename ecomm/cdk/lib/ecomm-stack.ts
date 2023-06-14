import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ECommStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new cdk.aws_ec2.Vpc(this, "ecomm_vpc", {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'internal',
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'public',
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        },
      ],
      natGateways: 2,
      maxAzs: 2,
    })

    const eks = new cdk.aws_eks.Cluster(this, "ecomm_eks", {
      clusterName: "ecomm_eks",
      version: cdk.aws_eks.KubernetesVersion.V1_26,
      vpc: vpc,
    })
    const nodegroup = eks.addNodegroupCapacity("ecomm_eks_nodegroup")

    const ec2 = new cdk.aws_ec2.Instance(this, "ecomm_traffic", {
      instanceType: cdk.aws_ec2.InstanceType.of(cdk.aws_ec2.InstanceClass.T2, cdk.aws_ec2.InstanceSize.MICRO),
      vpc: vpc,
      machineImage: new cdk.aws_ec2.AmazonLinuxImage(),
    })

  }
}
