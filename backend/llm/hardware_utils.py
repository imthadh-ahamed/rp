"""
GPU Detection and Hardware Utilities
"""
import platform
import subprocess
import os


def detect_gpu():
    """
    Detect if GPU is available and return GPU info.
    
    Returns:
        dict: GPU information including type, available, and memory
    """
    gpu_info = {
        "available": False,
        "type": None,
        "memory_gb": 0,
        "count": 0,
        "name": None
    }
    
    try:
        # Try NVIDIA GPU detection first
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')
            gpu_info["available"] = True
            gpu_info["type"] = "NVIDIA"
            gpu_info["count"] = len(lines)
            
            if lines:
                first_gpu = lines[0].split(',')
                gpu_info["name"] = first_gpu[0].strip()
                # Extract memory in GB
                memory_str = first_gpu[1].strip()
                if "MiB" in memory_str:
                    memory_mb = int(memory_str.replace("MiB", "").strip())
                    gpu_info["memory_gb"] = round(memory_mb / 1024, 2)
            
            return gpu_info
            
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    
    # Check for AMD GPU on Windows
    if platform.system() == "Windows":
        try:
            result = subprocess.run(
                ["wmic", "path", "win32_VideoController", "get", "name,AdapterRAM"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')[1:]  # Skip header
                for line in lines:
                    line = line.strip()
                    if line and ("AMD" in line or "Radeon" in line or "NVIDIA" in line or "Intel" in line):
                        parts = line.rsplit(None, 1)
                        if len(parts) == 2:
                            name, ram = parts
                            try:
                                ram_bytes = int(ram)
                                ram_gb = round(ram_bytes / (1024**3), 2)
                                
                                # Only consider dedicated GPUs with >2GB
                                if ram_gb >= 2:
                                    gpu_info["available"] = True
                                    gpu_info["name"] = name.strip()
                                    gpu_info["memory_gb"] = ram_gb
                                    gpu_info["count"] = 1
                                    
                                    if "NVIDIA" in name:
                                        gpu_info["type"] = "NVIDIA"
                                    elif "AMD" in name or "Radeon" in name:
                                        gpu_info["type"] = "AMD"
                                    else:
                                        gpu_info["type"] = "Integrated"
                                    
                                    return gpu_info
                            except ValueError:
                                pass
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
    
    return gpu_info


def get_system_info():
    """
    Get comprehensive system information.
    
    Returns:
        dict: System specs including CPU, RAM, GPU
    """
    import psutil
    
    gpu = detect_gpu()
    
    return {
        "platform": platform.system(),
        "processor": platform.processor(),
        "cpu_cores": os.cpu_count(),
        "ram_gb": round(psutil.virtual_memory().total / (1024**3), 2),
        "gpu": gpu
    }


def should_use_gpu():
    """
    Determine if GPU should be used for inference.
    
    Returns:
        bool: True if GPU is available and suitable
    """
    gpu_info = detect_gpu()
    
    # Use GPU if:
    # 1. GPU is available
    # 2. Has at least 4GB VRAM (enough for smaller models)
    if gpu_info["available"] and gpu_info["memory_gb"] >= 4:
        return True
    
    return False


if __name__ == "__main__":
    # Test GPU detection
    print("="*60)
    print("Hardware Detection Test")
    print("="*60)
    
    sys_info = get_system_info()
    
    print(f"\n💻 System: {sys_info['platform']}")
    print(f"🔧 Processor: {sys_info['processor']}")
    print(f"⚡ CPU Cores: {sys_info['cpu_cores']}")
    print(f"🎮 RAM: {sys_info['ram_gb']} GB")
    
    gpu = sys_info['gpu']
    if gpu['available']:
        print(f"\n✅ GPU Detected!")
        print(f"   Type: {gpu['type']}")
        print(f"   Name: {gpu['name']}")
        print(f"   VRAM: {gpu['memory_gb']} GB")
        print(f"   Count: {gpu['count']}")
        print(f"\n🚀 GPU acceleration: ENABLED")
    else:
        print(f"\n❌ No suitable GPU detected")
        print(f"🐢 GPU acceleration: DISABLED (using CPU)")
    
    print("\n" + "="*60)
