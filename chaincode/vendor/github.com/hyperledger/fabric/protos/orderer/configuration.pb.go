// Code generated by protoc-gen-go. DO NOT EDIT.
// source: orderer/configuration.proto

package orderer // import "github.com/hyperledger/fabric/protos/orderer"

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

// State defines the orderer mode of operation, typically for consensus-type migration.
// NORMAL is during normal operation, when consensus-type migration is not, and can not, take place.
// MAINTENANCE is when the consensus-type can be changed.
type ConsensusType_State int32

const (
	ConsensusType_STATE_NORMAL      ConsensusType_State = 0
	ConsensusType_STATE_MAINTENANCE ConsensusType_State = 1
)

var ConsensusType_State_name = map[int32]string{
	0: "STATE_NORMAL",
	1: "STATE_MAINTENANCE",
}
var ConsensusType_State_value = map[string]int32{
	"STATE_NORMAL":      0,
	"STATE_MAINTENANCE": 1,
}

func (x ConsensusType_State) String() string {
	return proto.EnumName(ConsensusType_State_name, int32(x))
}
func (ConsensusType_State) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_configuration_3a2420d24de6d468, []int{0, 0}
}

type ConsensusType struct {
	// The consensus type: "solo", "kafka" or "etcdraft".
	Type string `protobuf:"bytes,1,opt,name=type,proto3" json:"type,omitempty"`
	// Opaque metadata, dependent on the consensus type.
	Metadata []byte `protobuf:"bytes,2,opt,name=metadata,proto3" json:"metadata,omitempty"`
	// The state signals the ordering service to go into maintenance mode, typically for consensus-type migration.
	State                ConsensusType_State `protobuf:"varint,3,opt,name=state,proto3,enum=orderer.ConsensusType_State" json:"state,omitempty"`
	XXX_NoUnkeyedLiteral struct{}            `json:"-"`
	XXX_unrecognized     []byte              `json:"-"`
	XXX_sizecache        int32               `json:"-"`
}

func (m *ConsensusType) Reset()         { *m = ConsensusType{} }
func (m *ConsensusType) String() string { return proto.CompactTextString(m) }
func (*ConsensusType) ProtoMessage()    {}
func (*ConsensusType) Descriptor() ([]byte, []int) {
	return fileDescriptor_configuration_3a2420d24de6d468, []int{0}
}
func (m *ConsensusType) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ConsensusType.Unmarshal(m, b)
}
func (m *ConsensusType) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ConsensusType.Marshal(b, m, deterministic)
}
func (dst *ConsensusType) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ConsensusType.Merge(dst, src)
}
func (m *ConsensusType) XXX_Size() int {
	return xxx_messageInfo_ConsensusType.Size(m)
}
func (m *ConsensusType) XXX_DiscardUnknown() {
	xxx_messageInfo_ConsensusType.DiscardUnknown(m)
}

var xxx_messageInfo_ConsensusType proto.InternalMessageInfo

func (m *ConsensusType) GetType() string {
	if m != nil {
		return m.Type
	}
	return ""
}

func (m *ConsensusType) GetMetadata() []byte {
	if m != nil {
		return m.Metadata
	}
	return nil
}

func (m *ConsensusType) GetState() ConsensusType_State {
	if m != nil {
		return m.State
	}
	return ConsensusType_STATE_NORMAL
}

type BatchSize struct {
	// Simply specified as number of messages for now, in the future
	// we may want to allow this to be specified by size in bytes
	MaxMessageCount uint32 `protobuf:"varint,1,opt,name=max_message_count,json=maxMessageCount,proto3" json:"max_message_count,omitempty"`
	// The byte count of the serialized messages in a batch cannot
	// exceed this value.
	AbsoluteMaxBytes uint32 `protobuf:"varint,2,opt,name=absolute_max_bytes,json=absoluteMaxBytes,proto3" json:"absolute_max_bytes,omitempty"`
	// The byte count of the serialized messages in a batch should not
	// exceed this value.
	PreferredMaxBytes    uint32   `protobuf:"varint,3,opt,name=preferred_max_bytes,json=preferredMaxBytes,proto3" json:"preferred_max_bytes,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *BatchSize) Reset()         { *m = BatchSize{} }
func (m *BatchSize) String() string { return proto.CompactTextString(m) }
func (*BatchSize) ProtoMessage()    {}
func (*BatchSize) Descriptor() ([]byte, []int) {
	return fileDescriptor_configuration_3a2420d24de6d468, []int{1}
}
func (m *BatchSize) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_BatchSize.Unmarshal(m, b)
}
func (m *BatchSize) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_BatchSize.Marshal(b, m, deterministic)
}
func (dst *BatchSize) XXX_Merge(src proto.Message) {
	xxx_messageInfo_BatchSize.Merge(dst, src)
}
func (m *BatchSize) XXX_Size() int {
	return xxx_messageInfo_BatchSize.Size(m)
}
func (m *BatchSize) XXX_DiscardUnknown() {
	xxx_messageInfo_BatchSize.DiscardUnknown(m)
}

var xxx_messageInfo_BatchSize proto.InternalMessageInfo

func (m *BatchSize) GetMaxMessageCount() uint32 {
	if m != nil {
		return m.MaxMessageCount
	}
	return 0
}

func (m *BatchSize) GetAbsoluteMaxBytes() uint32 {
	if m != nil {
		return m.AbsoluteMaxBytes
	}
	return 0
}

func (m *BatchSize) GetPreferredMaxBytes() uint32 {
	if m != nil {
		return m.PreferredMaxBytes
	}
	return 0
}

type BatchTimeout struct {
	// Any duration string parseable by ParseDuration():
	// https://golang.org/pkg/time/#ParseDuration
	Timeout              string   `protobuf:"bytes,1,opt,name=timeout,proto3" json:"timeout,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *BatchTimeout) Reset()         { *m = BatchTimeout{} }
func (m *BatchTimeout) String() string { return proto.CompactTextString(m) }
func (*BatchTimeout) ProtoMessage()    {}
func (*BatchTimeout) Descriptor() ([]byte, []int) {
	return fileDescriptor_configuration_3a2420d24de6d468, []int{2}
}
func (m *BatchTimeout) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_BatchTimeout.Unmarshal(m, b)
}
func (m *BatchTimeout) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_BatchTimeout.Marshal(b, m, deterministic)
}
func (dst *BatchTimeout) XXX_Merge(src proto.Message) {
	xxx_messageInfo_BatchTimeout.Merge(dst, src)
}
func (m *BatchTimeout) XXX_Size() int {
	return xxx_messageInfo_BatchTimeout.Size(m)
}
func (m *BatchTimeout) XXX_DiscardUnknown() {
	xxx_messageInfo_BatchTimeout.DiscardUnknown(m)
}

var xxx_messageInfo_BatchTimeout proto.InternalMessageInfo

func (m *BatchTimeout) GetTimeout() string {
	if m != nil {
		return m.Timeout
	}
	return ""
}

// Carries a list of bootstrap brokers, i.e. this is not the exclusive set of
// brokers an ordering service
type KafkaBrokers struct {
	// Each broker here should be identified using the (IP|host):port notation,
	// e.g. 127.0.0.1:7050, or localhost:7050 are valid entries
	Brokers              []string `protobuf:"bytes,1,rep,name=brokers,proto3" json:"brokers,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *KafkaBrokers) Reset()         { *m = KafkaBrokers{} }
func (m *KafkaBrokers) String() string { return proto.CompactTextString(m) }
func (*KafkaBrokers) ProtoMessage()    {}
func (*KafkaBrokers) Descriptor() ([]byte, []int) {
	return fileDescriptor_configuration_3a2420d24de6d468, []int{3}
}
func (m *KafkaBrokers) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_KafkaBrokers.Unmarshal(m, b)
}
func (m *KafkaBrokers) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_KafkaBrokers.Marshal(b, m, deterministic)
}
func (dst *KafkaBrokers) XXX_Merge(src proto.Message) {
	xxx_messageInfo_KafkaBrokers.Merge(dst, src)
}
func (m *KafkaBrokers) XXX_Size() int {
	return xxx_messageInfo_KafkaBrokers.Size(m)
}
func (m *KafkaBrokers) XXX_DiscardUnknown() {
	xxx_messageInfo_KafkaBrokers.DiscardUnknown(m)
}

var xxx_messageInfo_KafkaBrokers proto.InternalMessageInfo

func (m *KafkaBrokers) GetBrokers() []string {
	if m != nil {
		return m.Brokers
	}
	return nil
}

// ChannelRestrictions is the mssage which conveys restrictions on channel creation for an orderer
type ChannelRestrictions struct {
	MaxCount             uint64   `protobuf:"varint,1,opt,name=max_count,json=maxCount,proto3" json:"max_count,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *ChannelRestrictions) Reset()         { *m = ChannelRestrictions{} }
func (m *ChannelRestrictions) String() string { return proto.CompactTextString(m) }
func (*ChannelRestrictions) ProtoMessage()    {}
func (*ChannelRestrictions) Descriptor() ([]byte, []int) {
	return fileDescriptor_configuration_3a2420d24de6d468, []int{4}
}
func (m *ChannelRestrictions) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ChannelRestrictions.Unmarshal(m, b)
}
func (m *ChannelRestrictions) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ChannelRestrictions.Marshal(b, m, deterministic)
}
func (dst *ChannelRestrictions) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ChannelRestrictions.Merge(dst, src)
}
func (m *ChannelRestrictions) XXX_Size() int {
	return xxx_messageInfo_ChannelRestrictions.Size(m)
}
func (m *ChannelRestrictions) XXX_DiscardUnknown() {
	xxx_messageInfo_ChannelRestrictions.DiscardUnknown(m)
}

var xxx_messageInfo_ChannelRestrictions proto.InternalMessageInfo

func (m *ChannelRestrictions) GetMaxCount() uint64 {
	if m != nil {
		return m.MaxCount
	}
	return 0
}

func init() {
	proto.RegisterType((*ConsensusType)(nil), "orderer.ConsensusType")
	proto.RegisterType((*BatchSize)(nil), "orderer.BatchSize")
	proto.RegisterType((*BatchTimeout)(nil), "orderer.BatchTimeout")
	proto.RegisterType((*KafkaBrokers)(nil), "orderer.KafkaBrokers")
	proto.RegisterType((*ChannelRestrictions)(nil), "orderer.ChannelRestrictions")
	proto.RegisterEnum("orderer.ConsensusType_State", ConsensusType_State_name, ConsensusType_State_value)
}

func init() {
	proto.RegisterFile("orderer/configuration.proto", fileDescriptor_configuration_3a2420d24de6d468)
}

var fileDescriptor_configuration_3a2420d24de6d468 = []byte{
	// 403 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x54, 0x91, 0xc1, 0x8a, 0xdb, 0x30,
	0x10, 0x86, 0xeb, 0x66, 0xb7, 0xbb, 0x19, 0x92, 0x36, 0xd1, 0x52, 0x30, 0xdd, 0x1e, 0x82, 0xa1,
	0x10, 0xca, 0x22, 0x97, 0xf4, 0x09, 0x92, 0x90, 0x43, 0x69, 0x93, 0x82, 0xe2, 0x5e, 0x7a, 0x09,
	0x63, 0x67, 0xe2, 0x98, 0x8d, 0x2d, 0x23, 0xc9, 0x90, 0xf4, 0x3d, 0xfa, 0x08, 0x7d, 0xcf, 0x22,
	0xc9, 0xde, 0x6e, 0x6f, 0xf3, 0xff, 0xf3, 0x69, 0x98, 0xd1, 0x0f, 0xf7, 0x52, 0xed, 0x49, 0x91,
	0x8a, 0x33, 0x59, 0x1d, 0x8a, 0xbc, 0x51, 0x68, 0x0a, 0x59, 0xf1, 0x5a, 0x49, 0x23, 0xd9, 0x4d,
	0xdb, 0x8c, 0xfe, 0x04, 0x30, 0x5c, 0xca, 0x4a, 0x53, 0xa5, 0x1b, 0x9d, 0x5c, 0x6a, 0x62, 0x0c,
	0xae, 0xcc, 0xa5, 0xa6, 0x30, 0x98, 0x04, 0xd3, 0xbe, 0x70, 0x35, 0x7b, 0x07, 0xb7, 0x25, 0x19,
	0xdc, 0xa3, 0xc1, 0xf0, 0xe5, 0x24, 0x98, 0x0e, 0xc4, 0x93, 0x66, 0x33, 0xb8, 0xd6, 0x06, 0x0d,
	0x85, 0xbd, 0x49, 0x30, 0x7d, 0x3d, 0x7b, 0xcf, 0xdb, 0xd1, 0xfc, 0xbf, 0xb1, 0x7c, 0x6b, 0x19,
	0xe1, 0xd1, 0xe8, 0x13, 0x5c, 0x3b, 0xcd, 0x46, 0x30, 0xd8, 0x26, 0xf3, 0x64, 0xb5, 0xdb, 0x7c,
	0x17, 0xeb, 0xf9, 0xb7, 0xd1, 0x0b, 0xf6, 0x16, 0xc6, 0xde, 0x59, 0xcf, 0xbf, 0x6c, 0x92, 0xd5,
	0x66, 0xbe, 0x59, 0xae, 0x46, 0x41, 0xf4, 0x3b, 0x80, 0xfe, 0x02, 0x4d, 0x76, 0xdc, 0x16, 0xbf,
	0x88, 0x7d, 0x84, 0x71, 0x89, 0xe7, 0x5d, 0x49, 0x5a, 0x63, 0x4e, 0xbb, 0x4c, 0x36, 0x95, 0x71,
	0x0b, 0x0f, 0xc5, 0x9b, 0x12, 0xcf, 0x6b, 0xef, 0x2f, 0xad, 0xcd, 0x1e, 0x80, 0x61, 0xaa, 0xe5,
	0xa9, 0x31, 0xb4, 0xb3, 0x8f, 0xd2, 0x8b, 0x21, 0xed, 0xae, 0x18, 0x8a, 0x51, 0xd7, 0x59, 0xe3,
	0x79, 0x61, 0x7d, 0xc6, 0xe1, 0xae, 0x56, 0x74, 0x20, 0xa5, 0x68, 0xff, 0x0c, 0xef, 0x39, 0x7c,
	0xfc, 0xd4, 0xea, 0xf8, 0x68, 0x0a, 0x03, 0xb7, 0x56, 0x52, 0x94, 0x24, 0x1b, 0xc3, 0x42, 0xb8,
	0x31, 0xbe, 0x6c, 0x3f, 0xb0, 0x93, 0x96, 0xfc, 0x8a, 0x87, 0x47, 0x5c, 0x28, 0xf9, 0x48, 0x4a,
	0x5b, 0x32, 0xf5, 0x65, 0x18, 0x4c, 0x7a, 0x96, 0x6c, 0x65, 0x34, 0x83, 0xbb, 0xe5, 0x11, 0xab,
	0x8a, 0x4e, 0x82, 0xb4, 0x51, 0x45, 0x66, 0x83, 0xd3, 0xec, 0x1e, 0xfa, 0x76, 0xa1, 0x7f, 0xc7,
	0x5e, 0x89, 0xdb, 0x12, 0xcf, 0xee, 0xca, 0xc5, 0x0f, 0xf8, 0x20, 0x55, 0xce, 0x8f, 0x97, 0x9a,
	0xd4, 0x89, 0xf6, 0x39, 0x29, 0x7e, 0xc0, 0x54, 0x15, 0x99, 0x0f, 0x5c, 0x77, 0xa9, 0xfc, 0x7c,
	0xc8, 0x0b, 0x73, 0x6c, 0x52, 0x9e, 0xc9, 0x32, 0x7e, 0x46, 0xc7, 0x9e, 0x8e, 0x3d, 0x1d, 0xb7,
	0x74, 0xfa, 0xca, 0xe9, 0xcf, 0x7f, 0x03, 0x00, 0x00, 0xff, 0xff, 0x90, 0x7c, 0x05, 0xd3, 0x4d,
	0x02, 0x00, 0x00,
}
