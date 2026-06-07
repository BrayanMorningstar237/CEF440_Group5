import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';
import { formatNumber } from '../utils/format';

export function RecordCard({ record, expanded, onToggle, showUser }) {
  const provider = record.isp_provider ?? record.ispProvider ?? 'Unknown provider';
  const createdAt = record.created_at ?? record.createdAt;
  const network = record.connection_label ?? record.connectionLabel ?? record.network_type ?? record.networkType;
  const latency = record.latency_ms ?? record.latencyMs;
  const download = record.download_mbps ?? record.downloadMbps;
  const upload = record.upload_mbps ?? record.uploadMbps;
  const loss = record.packet_loss_percent ?? record.packetLossPercent;
  const rating = record.stability_rating ?? record.stabilityRating ?? record.overall_rating ?? record.overallRating;
  const uploaded = record.uploaded_at;
  return (
    <Pressable onPress={onToggle} style={styles.recordCard}>
      <View style={styles.recordTop}>
        <View style={styles.recordTitleWrap}>
          <Text style={styles.recordTitle}>{provider}</Text>
          <Text style={styles.recordDate}>{createdAt ? new Date(createdAt).toLocaleString() : 'No date'}</Text>
        </View>
        <Text style={styles.recordBadge}>{uploaded ? 'uploaded' : record.source ?? 'server'}</Text>
      </View>
      {showUser && (
        <Text style={styles.detail}>
          User: {record.userName ?? 'Unknown'} | {record.userEmail ?? 'N/A'}
        </Text>
      )}
      <Text style={styles.detail}>
        {network ?? 'Unknown network'} | Rating {rating ?? 'N/A'} | Latency{' '}
        {formatNumber(latency, ' ms')}
      </Text>
      {expanded && (
        <View style={styles.recordDetails}>
          <Text style={styles.detail}>Download: {formatNumber(download, ' Mbps')}</Text>
          <Text style={styles.detail}>Upload: {formatNumber(upload, ' Mbps')}</Text>
          <Text style={styles.detail}>Jitter: {formatNumber(record.jitter_ms ?? record.jitterMs, ' ms')}</Text>
          <Text style={styles.detail}>Packet loss: {formatNumber(loss, '%')}</Text>
          <Text style={styles.detail}>IP address: {record.ip_address ?? record.ipAddress ?? 'N/A'}</Text>
          <Text style={styles.detail}>
            GPS: {formatNumber(record.latitude)}, {formatNumber(record.longitude)} | Accuracy:{' '}
            {formatNumber(record.accuracy_m ?? record.accuracyM, ' m')}
          </Text>
          <Text style={styles.detail}>
            Browsing: {record.browsing_rating ?? record.browsingRating ?? record.response_time_rating ?? 'N/A'} | Streaming:{' '}
            {record.streaming_rating ?? record.streamingRating ?? record.usability_rating ?? 'N/A'}
          </Text>
          {!!record.comment && <Text style={styles.commentText}>{record.comment}</Text>}
        </View>
      )}
    </Pressable>
  );
}
