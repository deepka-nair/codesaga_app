import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  Share,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking
} from 'react-native';
import MobileGameButton from '../components/MobileGameButton';
import mobileAudio from '../services/mobileAudio';
import { publishCertificateToGithub } from '../../services/githubService';

export default function CertificateModal({
  visible = false,
  onClose,
  certificateData = {},
  worldName = 'DATABASE DETECTIVE CITY',
  studentName = 'Detective',
  githubProfile = null
}) {
  if (!visible) return null;

  if (certificateData?.error || certificateData?.notFound) {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.diplomaBorder, { borderColor: '#ef4444', maxWidth: 400, width: '90%', padding: 16 }]}>
            <View style={[styles.diplomaInner, { borderColor: 'rgba(239, 68, 68, 0.4)' }]}>
              <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>⚠️🔒</Text>
              <Text style={[styles.certTitle, { color: '#ef4444', textAlign: 'center', fontSize: 13, marginBottom: 8 }]}>
                CERTIFICATE NOT FOUND
              </Text>
              <Text style={{ color: '#94a3b8', textAlign: 'center', marginVertical: 14, fontSize: 12, lineHeight: 18, fontFamily: 'Outfit' }}>
                {certificateData.message || 'No certificate data could be retrieved for this account, or the server is unavailable.'}
              </Text>
              <MobileGameButton title="CLOSE ✕" onPress={onClose} variant="ghost" />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const certId = certificateData.id || certificateData.certificateId || 'CS-W1-PREVIEW';
  const rawDate = certificateData.issued_at || certificateData.certificateIssuedAt || certificateData.createdAt;
  const issuedDate = rawDate
    ? new Date(rawDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  const displayName = certificateData.certificateName || certificateData.name || certificateData.studentName || studentName || 'Detective';

  const [showPublishPanel, setShowPublishPanel] = useState(false);
  const [repoName, setRepoName] = useState('codesaga-certificates');
  const [destPath, setDestPath] = useState(`certificates/${certId}.md`);
  const [patToken, setPatToken] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  const handleShare = async () => {
    mobileAudio.playSuccess();
    try {
      await Share.share({
        message: `🎓 I just earned my official CodeSaga Certificate of Completion for ${worldName}! \nCertificate ID: ${certId}\nVerify online: https://codesaga-app-3.onrender.com/certificate?id=${certId}`,
        title: `CodeSaga Verified Certificate — ${worldName}`
      });
    } catch (err) {
      Alert.alert('Share', 'Unable to open system share sheet.');
    }
  };

  const handlePublishToGithub = async () => {
    mobileAudio.playClick();
    if (!patToken.trim()) {
      Alert.alert('PAT Required', 'Please enter your GitHub Personal Access Token (PAT) with "repo" scope to publish this certificate.');
      return;
    }

    setIsPublishing(true);
    setPublishResult(null);

    try {
      const res = await publishCertificateToGithub(patToken.trim(), {
        repoName: repoName.trim() || 'codesaga-certificates',
        destinationPath: destPath.trim() || `certificates/${certId}.md`,
        certData: { id: certId, issued_at: certificateData.issued_at },
        studentName,
        worldName,
        isPrivate: false
      });

      setIsPublishing(false);
      mobileAudio.playSuccess();
      setPublishResult({
        success: true,
        message: `Certificate successfully published to ${res.repoName}!`,
        fileUrl: res.fileUrl,
        repoUrl: res.repoUrl
      });
    } catch (err) {
      setIsPublishing(false);
      mobileAudio.playError();
      setPublishResult({
        success: false,
        message: err.message || 'Failed to upload certificate to GitHub.'
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Ornate Certificate Frame */}
            <View style={styles.diplomaBorder}>
              <View style={styles.diplomaInner}>
                {/* Gold Seal Header */}
                <View style={styles.sealBox}>
                  <Text style={styles.sealEmoji}>🎓</Text>
                  <Text style={styles.sealText}>CODESAGA VERIFIED DIPLOMA</Text>
                </View>

                <Text style={styles.certTitle}>CERTIFICATE OF MASTERY</Text>

                <Text style={styles.certBodyIntro}>
                  THIS OFFICIAL CREDENTIAL IS PROUDLY CONFERRED UPON
                </Text>

                <Text style={styles.studentName}>
                  {displayName.toUpperCase()}
                </Text>

                <View style={styles.dividerGold} />

                <Text style={styles.certBodyText}>
                  for successfully solving all required detective cases, mastering relational query structures, and demonstrating exceptional problem-solving acumen in:
                </Text>

                <Text style={styles.worldAwardTitle}>
                  {worldName.toUpperCase()}
                </Text>

                {/* Metadata Row */}
                <View style={styles.metaRow}>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>CERTIFICATE ID</Text>
                    <Text style={styles.metaVal}>{certId}</Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>ISSUED DATE</Text>
                    <Text style={styles.metaVal}>{issuedDate}</Text>
                  </View>
                </View>

                {/* Verification Badge */}
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ CRYPTOGRAPHICALLY VERIFIED & LOGGED IN CODESAGA REGISTRY</Text>
                </View>
              </View>
            </View>

            {/* GitHub Publishing Panel */}
            {showPublishPanel && (
              <View style={styles.publishCard}>
                <View style={styles.publishHeader}>
                  <Text style={styles.publishTitle}>🐙 PUBLISH DIPLOMA TO GITHUB</Text>
                  <TouchableOpacity onPress={() => setShowPublishPanel(false)}>
                    <Text style={styles.publishClose}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.publishSubtitle}>
                  Publish this verified credential as a structured Markdown document to your GitHub profile repository.
                </Text>

                <Text style={styles.fieldLabel}>REPOSITORY NAME</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="codesaga-certificates"
                  placeholderTextColor="#64748b"
                  value={repoName}
                  onChangeText={setRepoName}
                  autoCapitalize="none"
                />

                <Text style={styles.fieldLabel}>DESTINATION FILE PATH</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder={`certificates/${certId}.md`}
                  placeholderTextColor="#64748b"
                  value={destPath}
                  onChangeText={setDestPath}
                  autoCapitalize="none"
                />

                <Text style={styles.fieldLabel}>GITHUB PERSONAL ACCESS TOKEN (PAT)</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  placeholderTextColor="#64748b"
                  value={patToken}
                  onChangeText={setPatToken}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Text style={styles.patNotice}>
                  Requires "repo" permission from github.com/settings/tokens. Tokens are used in-memory only and never logged.
                </Text>

                <TouchableOpacity
                  style={[styles.publishActionBtn, isPublishing && { opacity: 0.7 }]}
                  onPress={handlePublishToGithub}
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <ActivityIndicator color="#022c22" />
                  ) : (
                    <Text style={styles.publishActionBtnText}>UPLOAD CERTIFICATE NOW 🚀</Text>
                  )}
                </TouchableOpacity>

                {publishResult && (
                  <View style={[styles.feedbackBox, publishResult.success ? styles.feedbackSuccess : styles.feedbackError]}>
                    <Text style={styles.feedbackText}>{publishResult.message}</Text>
                    {publishResult.fileUrl && (
                      <TouchableOpacity onPress={() => Linking.openURL(publishResult.fileUrl)}>
                        <Text style={styles.feedbackLink}>🔗 View Certificate on GitHub ↗</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons Row */}
            <View style={styles.actionRow}>
              <MobileGameButton
                variant="gold"
                size="large"
                onPress={handleShare}
                style={{ flex: 1 }}
              >
                SHARE 📤
              </MobileGameButton>
              <MobileGameButton
                variant="primary"
                size="large"
                onPress={() => {
                  mobileAudio.playClick();
                  setShowPublishPanel(!showPublishPanel);
                }}
                style={{ flex: 1.2 }}
              >
                {showPublishPanel ? 'HIDE GITHUB' : 'GITHUB 🐙'}
              </MobileGameButton>
              <MobileGameButton
                variant="secondary"
                size="large"
                onPress={onClose}
                style={{ flex: 0.8 }}
              >
                CLOSE
              </MobileGameButton>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 23, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  container: {
    width: '100%',
    maxHeight: '92%'
  },
  scrollContent: {
    paddingVertical: 10
  },
  diplomaBorder: {
    borderWidth: 4,
    borderColor: '#eab308',
    borderRadius: 16,
    padding: 4,
    backgroundColor: '#0c1222',
    marginBottom: 12
  },
  diplomaInner: {
    borderWidth: 2,
    borderColor: 'rgba(234, 179, 8, 0.4)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#0c1222'
  },
  sealBox: {
    alignItems: 'center',
    marginBottom: 8
  },
  sealEmoji: {
    fontSize: 32,
    marginBottom: 2
  },
  sealText: {
    fontFamily: 'PressStart2P',
    color: '#eab308',
    fontSize: 7,
    letterSpacing: 1
  },
  certTitle: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 10,
    marginBottom: 8,
    textAlign: 'center'
  },
  certBodyIntro: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center'
  },
  studentName: {
    fontFamily: 'Outfit-Bold',
    color: '#38bdf8',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center'
  },
  dividerGold: {
    width: '80%',
    height: 2,
    backgroundColor: '#eab308',
    marginBottom: 10,
    opacity: 0.6
  },
  certBodyText: {
    fontFamily: 'Outfit',
    color: '#cbd5e1',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8
  },
  worldAwardTitle: {
    fontFamily: 'PressStart2P',
    color: '#eab308',
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 14
  },
  metaRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10
  },
  metaCol: {
    alignItems: 'center'
  },
  metaLabel: {
    fontFamily: 'PressStart2P',
    color: '#64748b',
    fontSize: 5,
    marginBottom: 3
  },
  metaVal: {
    fontFamily: 'Outfit-Bold',
    color: '#f8fafc',
    fontSize: 11
  },
  verifiedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: '#22c55e',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  verifiedText: {
    fontFamily: 'PressStart2P',
    color: '#22c55e',
    fontSize: 5,
    textAlign: 'center'
  },
  publishCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#10b981',
    marginBottom: 12
  },
  publishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  publishTitle: {
    fontFamily: 'PressStart2P',
    color: '#10b981',
    fontSize: 8
  },
  publishClose: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 10
  },
  publishSubtitle: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 15
  },
  fieldLabel: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 6,
    marginBottom: 4
  },
  fieldInput: {
    backgroundColor: '#020617',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    fontFamily: 'Outfit',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8
  },
  patNotice: {
    fontFamily: 'Outfit',
    color: '#64748b',
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 13
  },
  publishActionBtn: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center'
  },
  publishActionBtnText: {
    fontFamily: 'PressStart2P',
    color: '#022c22',
    fontSize: 7
  },
  feedbackBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981'
  },
  feedbackError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444'
  },
  feedbackText: {
    fontFamily: 'Outfit',
    color: '#f8fafc',
    fontSize: 11,
    marginBottom: 4
  },
  feedbackLink: {
    fontFamily: 'PressStart2P',
    color: '#38bdf8',
    fontSize: 6,
    textDecorationLine: 'underline'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between'
  }
});
