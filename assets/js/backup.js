/**
 * Sistema de Backup e Sincronização - AlfaReview Geografia
 * Gerencia backup automático, sincronização e recuperação de dados
 */

class BackupManager {
    constructor() {
        this.autoBackupInterval = 5 * 60 * 1000; // 5 minutos
        this.maxBackups = 5;
        this.backupTimer = null;
        
        this.init();
    }
    
    /**
     * Inicializa sistema de backup
     */
    init() {
        // Aguarda storageManager estar disponível
        if (typeof window.storageManager === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.startAutoBackup();
        this.bindEvents();
        this.cleanupOldBackups();
    }
    
    /**
     * Inicia backup automático
     */
    startAutoBackup() {
        this.backupTimer = setInterval(() => {
            this.createAutoBackup();
        }, this.autoBackupInterval);
    }
    
    /**
     * Para backup automático
     */
    stopAutoBackup() {
        if (this.backupTimer) {
            clearInterval(this.backupTimer);
            this.backupTimer = null;
        }
    }
    
    /**
     * Vincula eventos do sistema
     */
    bindEvents() {
        // Backup antes de fechar a página
        window.addEventListener('beforeunload', () => {
            this.createAutoBackup();
        });
        
        // Backup quando dados são atualizados
        window.addEventListener('alfareview:dataUpdated', () => {
            this.createAutoBackup();
        });
        
        // Detecta quando a aba fica inativa
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.createAutoBackup();
            }
        });
    }
    
    /**
     * Cria backup automático
     */
    createAutoBackup() {
        try {
            const data = window.storageManager.loadData();
            const backupKey = `alfareview_auto_backup_${Date.now()}`;
            
            const backupData = {
                type: 'auto',
                timestamp: new Date().toISOString(),
                data: data
            };
            
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            
            // Limita número de backups automáticos
            this.limitAutoBackups();
            
            console.log('Backup automático criado:', backupKey);
        } catch (error) {
            console.error('Erro ao criar backup automático:', error);
        }
    }
    
    /**
     * Limita número de backups automáticos
     */
    limitAutoBackups() {
        try {
            const keys = Object.keys(localStorage);
            const autoBackupKeys = keys
                .filter(key => key.startsWith('alfareview_auto_backup_'))
                .sort()
                .reverse(); // Mais recentes primeiro
            
            // Remove backups excedentes
            if (autoBackupKeys.length > this.maxBackups) {
                const keysToRemove = autoBackupKeys.slice(this.maxBackups);
                keysToRemove.forEach(key => {
                    localStorage.removeItem(key);
                });
            }
        } catch (error) {
            console.error('Erro ao limitar backups:', error);
        }
    }
    
    /**
     * Lista backups disponíveis
     */
    listBackups() {
        try {
            const keys = Object.keys(localStorage);
            const backups = [];
            
            keys.forEach(key => {
                if (key.startsWith('alfareview_auto_backup_') || key.startsWith('alfareview_manual_backup_')) {
                    try {
                        const backupData = JSON.parse(localStorage.getItem(key));
                        backups.push({
                            key: key,
                            type: backupData.type || 'auto',
                            timestamp: backupData.timestamp,
                            studentName: backupData.data?.studentName || 'Desconhecido',
                            size: new Blob([localStorage.getItem(key)]).size
                        });
                    } catch (e) {
                        // Backup corrompido, remove
                        localStorage.removeItem(key);
                    }
                }
            });
            
            return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('Erro ao listar backups:', error);
            return [];
        }
    }
    
    /**
     * Restaura backup específico
     */
    restoreBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                return { success: false, message: 'Backup não encontrado' };
            }
            
            const backup = JSON.parse(backupData);
            if (!backup.data) {
                return { success: false, message: 'Dados de backup inválidos' };
            }
            
            // Cria backup dos dados atuais antes de restaurar
            this.createManualBackup('pre_restore');
            
            // Restaura dados
            localStorage.setItem(window.storageManager.storageKey, JSON.stringify(backup.data));
            
            // Dispara evento de atualização
            const event = new CustomEvent('alfareview:dataRestored', {
                detail: { backupKey, timestamp: backup.timestamp }
            });
            window.dispatchEvent(event);
            
            return { 
                success: true, 
                message: 'Backup restaurado com sucesso',
                studentName: backup.data.studentName,
                timestamp: backup.timestamp
            };
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            return { success: false, message: 'Erro ao restaurar backup: ' + error.message };
        }
    }
    
    /**
     * Cria backup manual
     */
    createManualBackup(reason = 'manual') {
        try {
            const data = window.storageManager.loadData();
            const backupKey = `alfareview_manual_backup_${reason}_${Date.now()}`;
            
            const backupData = {
                type: 'manual',
                reason: reason,
                timestamp: new Date().toISOString(),
                data: data
            };
            
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            
            return { success: true, key: backupKey };
        } catch (error) {
            console.error('Erro ao criar backup manual:', error);
            return { success: false, message: error.message };
        }
    }
    
    /**
     * Remove backup específico
     */
    removeBackup(backupKey) {
        try {
            localStorage.removeItem(backupKey);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    /**
     * Limpa backups antigos
     */
    cleanupOldBackups() {
        try {
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const keys = Object.keys(localStorage);
            
            keys.forEach(key => {
                if (key.startsWith('alfareview_auto_backup_')) {
                    try {
                        const timestamp = parseInt(key.split('_').pop());
                        if (timestamp < sevenDaysAgo) {
                            localStorage.removeItem(key);
                        }
                    } catch (e) {
                        // Remove chaves malformadas
                        localStorage.removeItem(key);
                    }
                }
            });
        } catch (error) {
            console.error('Erro na limpeza de backups:', error);
        }
    }
    
    /**
     * Exporta backup para arquivo
     */
    exportBackupToFile(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                return { success: false, message: 'Backup não encontrado' };
            }
            
            const backup = JSON.parse(backupData);
            const filename = `alfareview_backup_${backup.data.studentName}_${backup.timestamp.split('T')[0]}.json`;
            
            const dataBlob = new Blob([backupData], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            return { success: true, filename };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    /**
     * Obtém estatísticas de backup
     */
    getBackupStats() {
        const backups = this.listBackups();
        const autoBackups = backups.filter(b => b.type === 'auto');
        const manualBackups = backups.filter(b => b.type === 'manual');
        
        const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
        
        return {
            total: backups.length,
            auto: autoBackups.length,
            manual: manualBackups.length,
            totalSizeKB: Math.round(totalSize / 1024 * 100) / 100,
            oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null,
            newestBackup: backups.length > 0 ? backups[0].timestamp : null
        };
    }
    
    /**
     * Verifica integridade de todos os backups
     */
    verifyBackupIntegrity() {
        const backups = this.listBackups();
        const results = {
            total: backups.length,
            valid: 0,
            corrupted: [],
            repaired: 0
        };
        
        backups.forEach(backup => {
            try {
                const backupData = JSON.parse(localStorage.getItem(backup.key));
                if (backupData.data && backupData.timestamp) {
                    results.valid++;
                } else {
                    results.corrupted.push(backup.key);
                }
            } catch (error) {
                results.corrupted.push(backup.key);
            }
        });
        
        // Remove backups corrompidos
        results.corrupted.forEach(key => {
            localStorage.removeItem(key);
            results.repaired++;
        });
        
        return results;
    }
    
    /**
     * Sincroniza com outras abas
     */
    syncWithOtherTabs() {
        // Dispara evento para outras abas saberem que dados foram atualizados
        const event = new StorageEvent('storage', {
            key: window.storageManager.storageKey,
            newValue: localStorage.getItem(window.storageManager.storageKey),
            url: window.location.href
        });
        
        window.dispatchEvent(event);
    }
}

// Instância global do gerenciador de backup
window.backupManager = new BackupManager();

