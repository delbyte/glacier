// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GlacierPayments
 * @dev Handles payment distribution for decentralized file storage on Glacier
 * Conversion: 10 GLCR = 1 AVAX (1 GLCR = 0.1 AVAX)
 */
contract GlacierPayments {
    // Events
    event FileUploaded(
        address indexed uploader,
        uint256 fileSize,
        uint256 totalCost,
        uint256 providerCount,
        uint256 timestamp
    );
    
    event PaymentDistributed(
        address indexed provider,
        uint256 amount,
        address indexed uploader
    );
    
    event EarningsWithdrawn(
        address indexed provider,
        uint256 amount
    );

    // Provider earnings mapping
    mapping(address => uint256) public providerEarnings;
    
    // Contract owner
    address public owner;
    
    // Total files uploaded
    uint256 public totalFilesUploaded;
    
    // Total AVAX distributed
    uint256 public totalDistributed;

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Upload file and distribute payment to providers
     * @param providers Array of provider addresses
     * @param fileSizeBytes File size in bytes
     * Cost calculation: (fileSizeBytes / 1MB) * 0.001 GLCR * 0.1 AVAX/GLCR
     */
    function uploadFile(
        address[] calldata providers,
        uint256 fileSizeBytes
    ) external payable {
        require(providers.length > 0, "No providers specified");
        require(fileSizeBytes > 0, "Invalid file size");
        
        // Calculate expected cost
        // Formula: (fileSizeBytes / 1,048,576) * 0.001 GLCR * 0.1 AVAX/GLCR
        // Simplified: fileSizeBytes * 0.0000001 AVAX / 1MB
        // In wei: fileSizeBytes * 100000000000 / 1048576
        uint256 expectedCost = (fileSizeBytes * 100000000000) / 1048576;
        
        require(msg.value >= expectedCost, "Insufficient payment");
        
        // Calculate payment per provider
        uint256 paymentPerProvider = msg.value / providers.length;
        require(paymentPerProvider > 0, "Payment too small");
        
        // Distribute to providers
        for (uint256 i = 0; i < providers.length; i++) {
            address provider = providers[i];
            require(provider != address(0), "Invalid provider address");
            require(provider != msg.sender, "Cannot send to self");
            
            providerEarnings[provider] += paymentPerProvider;
            
            emit PaymentDistributed(provider, paymentPerProvider, msg.sender);
        }
        
        totalFilesUploaded++;
        totalDistributed += msg.value;
        
        emit FileUploaded(
            msg.sender,
            fileSizeBytes,
            msg.value,
            providers.length,
            block.timestamp
        );
        
        // Refund excess (if any)
        uint256 totalPaid = paymentPerProvider * providers.length;
        if (msg.value > totalPaid) {
            payable(msg.sender).transfer(msg.value - totalPaid);
        }
    }

    /**
     * @dev Withdraw accumulated earnings
     */
    function withdrawEarnings() external {
        uint256 earnings = providerEarnings[msg.sender];
        require(earnings > 0, "No earnings to withdraw");
        
        providerEarnings[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: earnings}("");
        require(success, "Transfer failed");
        
        emit EarningsWithdrawn(msg.sender, earnings);
    }

    /**
     * @dev Get provider earnings
     */
    function getProviderEarnings(address provider) external view returns (uint256) {
        return providerEarnings[provider];
    }

    /**
     * @dev Calculate upload cost for a given file size
     * @param fileSizeBytes File size in bytes
     * @return cost in wei
     */
    function calculateUploadCost(uint256 fileSizeBytes) public pure returns (uint256) {
        // (fileSizeBytes / 1MB) * 0.001 GLCR * 0.1 AVAX/GLCR
        return (fileSizeBytes * 100000000000) / 1048576;
    }

    /**
     * @dev Get contract stats
     */
    function getStats() external view returns (
        uint256 filesUploaded,
        uint256 totalDistributedAmount,
        uint256 contractBalance
    ) {
        return (
            totalFilesUploaded,
            totalDistributed,
            address(this).balance
        );
    }
}
